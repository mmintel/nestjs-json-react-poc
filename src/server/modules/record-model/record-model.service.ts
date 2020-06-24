import { Injectable, Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { Services } from '../record';
import { RecordModel } from './record-model.entity';
import { FieldConstructor } from '../../fields';

interface FieldConstructorRegistry {
  [key: string]: FieldConstructor,
}

@Injectable()
export class RecordModelService {
  private logger = new Logger('RecordModelService');
  private fields: FieldConstructorRegistry = {}

  public register(type: string, field: FieldConstructor): void {
    this.fields[type] = field;
    this.logger.verbose(`Registered field "${type}"!`)
  }

  public findByType(type: string): FieldConstructor {
    return this.fields[type];
  }

  public createRecordModel(services: Services, blueprint: Blueprint): RecordModel {
    return new RecordModel(this, services, blueprint)
  }
}