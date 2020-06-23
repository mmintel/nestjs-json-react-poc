import { Injectable, Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { RecordModel } from './record-model';
import { Field } from '../../fields';

interface FieldRegistry {
  [key: string]: Field,
}

@Injectable()
export class RecordModelService {
  private logger = new Logger('RecordModelService');
  private fields: FieldRegistry = {}

  public register(type: string, field: Field): void {
    this.fields[type] = field;
    this.logger.verbose(`Registered field "${type}"!`)
  }

  public findByType(type: string): Field {
    return this.fields[type];
  }

  public get(blueprint: Blueprint): RecordModel {
    return new RecordModel(this, blueprint)
  }
}