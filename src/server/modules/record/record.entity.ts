import { Json } from '../json';
import { Blueprint } from '../blueprint';
import { RecordModelService, RecordModel } from '../record-model';

export class BuildRecordException extends Error {
  name = 'BuildRecordException'
};

export interface Services {
  [key: string]: any,
}

export class Record {
  private recordModel: RecordModel|null = null;
  constructor(
    private recordModelService: RecordModelService,
    private blueprint: Blueprint,
    private data: Json,
  ) {
  }

  async init(services: Services) {
    this.recordModel = this.recordModelService.createRecordModel(services, this.blueprint);
    await this.recordModel.init();

    try {
      return this.recordModel.build(this.data)
    } catch (error) {
      throw new BuildRecordException(error.message);
    }
  }
}