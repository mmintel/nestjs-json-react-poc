import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JsonService, Json, AnyJson } from '../json';
import { BlueprintService, Blueprint } from '../blueprint'
import { FieldService } from '../field';
import { dirname, basename, resolve } from 'path';

export interface Record {
  meta: RecordMeta,
  data: RecordData
}

export interface RecordMeta {
  createdAt: Date,
  updatedAt: Date,
}

export type RecordData = Json

export const RECORD_NOT_FOUND_EXCEPTION = 'Record was not found.';

@Injectable()
export class RecordService {
  private logger = new Logger('RecordService');
  private contentPath: string;

  constructor(
    private jsonService: JsonService,
    private blueprintService: BlueprintService,
    private fieldService: FieldService,
    private configService: ConfigService
  ) {
    this.contentPath = this.configService.get<string>('contentPath') || '';
  }

  public async get(path: string): Promise<Record> {
    const contentPath = resolve(this.contentPath, path);
    const data = await this.getData(contentPath);
    const meta = await this.getMeta(contentPath);

    return {
      data,
      meta,
    };
  }

  private async getMeta(path: string): Promise<RecordMeta> {
    const stats = await this.jsonService.readMeta(path);

    if (!stats) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: RECORD_NOT_FOUND_EXCEPTION,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      createdAt: stats.createdAt,
      updatedAt: stats.updatedAt,
    };
  }

  private async getData(path: string): Promise<Json> {
    let json = await this.jsonService.readFile(path);
    const blueprintName = basename(dirname(path));
    const blueprint = await this.blueprintService.get(blueprintName);
    console.log('blueprint is', blueprint);

    if (!json) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: RECORD_NOT_FOUND_EXCEPTION,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    json = await this.jsonService.traverse(json, (json: Json, key: string, value: AnyJson) => this.transform({
      json,
      key,
      value,
      blueprint
    }));

    return json;
  }

  private transform = async ({
    json,
    key,
    value,
    blueprint
  }: {
    json: Json,
    key: string,
    value: AnyJson,
    blueprint: Blueprint
  }): Promise<Json> => {
    const newJson = {...json};
    const fieldDefinition = blueprint.data[key] as Json;

    if (!fieldDefinition) {
      this.logger.verbose('Field definition was not found.');
      return newJson;
    }

    if (!FieldService.isValidFieldDefinition(fieldDefinition)) {
      this.logger.verbose('Field definition is invalid.');
      return newJson;
    }

    try {
      const fieldType = this.fieldService.create({
        definition: fieldDefinition,
        value,
      });
      console.log(fieldType);
      newJson[key] = fieldType.serialize();
    } catch(e) {
      console.log(e);
    }

    return newJson;
  }
}
