import { Injectable, Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { RecordModel } from './record-model';
import { Field } from '../../fields';

interface FieldRegistry {
  [key: string]: Field<any>,
}

@Injectable()
export class RecordModelService {
  private logger = new Logger('RecordModelService');
  private fields: FieldRegistry = {}

  public register(type: string, field: Field<any>): void {
    this.fields[type] = field;
    this.logger.verbose(`Registered field "${type}"!`)
  }

  public findByType(type: string): Field<any> {
    return this.fields[type];
  }

  public createRecordModel(blueprint: Blueprint): RecordModel {
    return new RecordModel(this, blueprint)
  }
}