import { ValidationResult } from './../../utils/schema';
import { Injectable, Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { RecordModel } from './record-model';

export interface Field {
  type: string;
  init: (definition: FieldDefinition) => void,
  validate: (value: any) => ValidationResult | { value: any, error: string | null }
}

export interface FieldDefinition {
  [key: string]: any,
  type: string
}

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