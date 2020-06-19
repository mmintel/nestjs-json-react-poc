import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JsonService, Json, AnyJson } from '../json';
import { FileService } from '../file';
import { join, resolve } from 'path';

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
    private fileService: FileService,
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
    const stats = await this.fileService.readMeta(path);
    return stats;
  }

  private async getData(path: string): Promise<Json> {
    let json = await this.jsonService.get(path);

    if (!json) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: RECORD_NOT_FOUND_EXCEPTION,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    json = await JsonService.traverse(json, this.transform);

    return json;
  }

  private transform = async (json: Json, key: string, value: AnyJson): Promise<Json> => {
    const newJson = {...json};
    const relativePath = /(\/\w+)+$/;

    if (typeof value === 'string' && relativePath.test(value)) {
      const path = join(this.contentPath, value);

      const dependency = await this.getData(path);
      if (dependency) {
        newJson[key] = dependency;
      }
    }

    return newJson;
  }
}
