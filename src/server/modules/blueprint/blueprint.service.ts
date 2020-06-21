import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JsonService, Json } from '../json';
import { resolve } from 'path';

export interface Blueprint {
  meta: BlueprintMeta,
  data: BlueprintData
}

export interface BlueprintMeta {
  createdAt: Date,
  updatedAt: Date,
}

export type BlueprintData = Json

export const BLUEPRINT_NOT_FOUND_EXCEPTION = 'Blueprint was not found.';

@Injectable()
export class BlueprintService {
  private logger = new Logger('BlueprintService');
  private blueprintsPath: string;

  constructor(
    private jsonService: JsonService,
    private configService: ConfigService
  ) {
    this.blueprintsPath = this.configService.get<string>('blueprintsPath') || '';
  }

  public async get(path: string): Promise<Blueprint> {
    const blueprintsPath = resolve(this.blueprintsPath, path);
    const data = await this.getData(blueprintsPath);
    const meta = await this.getMeta(blueprintsPath);

    return {
      data,
      meta,
    };
  }

  private async getMeta(path: string): Promise<BlueprintMeta> {
    const stats = await this.jsonService.readMeta(path);

    if (!stats) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: BLUEPRINT_NOT_FOUND_EXCEPTION,
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
    const json = await this.jsonService.readFile(path);

    if (!json) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: BLUEPRINT_NOT_FOUND_EXCEPTION,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return json;
  }

}
