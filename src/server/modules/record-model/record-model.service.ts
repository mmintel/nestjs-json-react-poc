import { Injectable, Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { RecordModel } from './record-model';

export type Field = {
  [key: string]: any;
  type: string;
  required?: boolean;
}

interface Fields {
  [key: string]: Field,
}

@Injectable()
export class RecordModelService {
  private logger = new Logger('RecordModelService');
  private fields: Fields = {}

  public register(type: string, field: Field) {
    this.fields[type] = field;
    this.logger.verbose(`Registered field "${type}"!`)
  }

  public findByType(type: string): Field {
    return this.fields[type];
  }

  public get(blueprint: Blueprint): RecordModel {
    return new RecordModel(blueprint)
  }
}