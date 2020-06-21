import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JsonService, Json } from '../json';
import { resolve } from 'path';

export type Record = Json
export class RecordNotFoundException extends Error {};

@Injectable()
export class RecordService {
  private logger = new Logger('RecordService');
  private contentPath: string;

  constructor(
    private jsonService: JsonService,
    private configService: ConfigService
  ) {
    this.contentPath = this.configService.get<string>('contentPath') || '';
  }

  public async get(path: string): Promise<Record> {
    const contentPath = resolve(this.contentPath, path);
    const data = await this.getData(contentPath);

    return {
      data,
    };
  }

  private async getData(path: string): Promise<Json> {
    const json = await this.jsonService.getOne(path);

    if (!json) {
      throw new RecordNotFoundException('Record was not found.');
    }

    return json;
  }
}
