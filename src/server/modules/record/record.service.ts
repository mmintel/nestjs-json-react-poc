import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { JsonService, Json } from '../json';
import { BlueprintService } from '../blueprint';
import { RecordModelService } from '../record-model';
import { basename, dirname, resolve } from 'path';

export type Record = Json
export class RecordNotFoundException extends Error {};

@Injectable()
export class RecordService {
  private logger = new Logger('RecordService');
  private contentPath: string;

  constructor(
    private jsonService: JsonService,
    private blueprintService: BlueprintService,
    private recordModelService: RecordModelService,
    private configService: ConfigService
  ) {
    this.contentPath = this.configService.get<string>('contentPath') || '';
  }

  public async get(path: string): Promise<Record> {
    const contentPath = resolve(this.contentPath, path);

    this.logger.verbose(`Loading record at "${path}"...`);

    const data = await this.loadData(contentPath);
    const blueprintName = basename(dirname(contentPath));
    const blueprint = await this.blueprintService.get(blueprintName);
    const recordModel = this.recordModelService.get(blueprint);
    return recordModel.buildRecord(data)
  }

  private async loadData(path: string): Promise<Json> {
    try {
      return this.jsonService.load(path);
    } catch {
      throw new RecordNotFoundException('Record was not found.');
    }
  }
}
