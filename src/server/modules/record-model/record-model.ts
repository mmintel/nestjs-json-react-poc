import { Logger } from '@nestjs/common';
import { Blueprint } from '../blueprint';
import { Record } from '../record';
import { AnyJson } from '../json';
import { RecordModelService, FieldDefinition } from './record-model.service';

interface ApplyFieldsContext {
  value: AnyJson,
  definition: AnyJson,
}

export class FieldValidationError extends Error {}
export class FieldInitializationError extends Error {}
export class MissingFieldError extends Error {}
export class InvalidFieldDefinitionError extends Error {}

export class RecordModel {
  private logger = new Logger('RecordModel');

  constructor(
    private recordModelService: RecordModelService,
    private blueprint: Blueprint
  ) {}

  public buildRecord(record: Record): Record {
    this.logger.verbose(`Building record for ${JSON.stringify(record)}...`);
    const newRecord = {...record};
    // const newRecord = await this.traverse(this.blueprint, ({ data, key, value }) => this.applyFields({ data, key, value, record }));

    for (const [key, definition] of Object.entries(this.blueprint)) {
      newRecord[key] = this.applyField({ value: record[key], definition });
    }

    this.logger.verbose(`Built new record ${JSON.stringify(newRecord)}`);
    return newRecord;
  }

  private isValidFieldDefinition(definition: unknown): definition is FieldDefinition {
    return  Object.prototype.hasOwnProperty.call(definition, "type");
  }

  private applyField = ({ value, definition }: ApplyFieldsContext): AnyJson => {
    if (!this.isValidFieldDefinition(definition)) {
      throw new InvalidFieldDefinitionError('Provided definition does not have a type property.');
    }

    const type = definition.type;
    const field = this.recordModelService.findByType(type);

    if (!field) {
      throw new MissingFieldError(`Could not find field for type "${type}".`);
    }

    const fieldName = field.constructor.name;
    this.logger.verbose(`Using field "${fieldName}" for type "${type}".`)

    try {
      field.init(definition);
    } catch(e) {
      throw new FieldInitializationError(`Error initializing "${fieldName}" with "${JSON.stringify(definition)}": ${e.message}.`)
    }

    try {
      field.validate(value);
    } catch(e) {
      throw new FieldValidationError(`Error validating "${fieldName}" of "${JSON.stringify(value)}": ${e.message}.`);
    }
    // const fieldDefinition = this.blueprint[key] as Field;

    // this.logger.verbose(`Using field definition of blueprint ${JSON.stringify(fieldDefinition)}`);

    // const type = fieldDefinition.type;
    // const field = this.recordModelService.findByType(type);

    // if (!field) {
    //   this.logger.verbose(`No field found for type "${type}".`)
    //   return data;
    // }


    // console.log('Apply field to', key, value);

    // const { value, error } = field.validateValue(value);

    // if (error) {
    //   throw new FieldValidationError(error)
    // }

    return value;
  }

  // private async traverse(data: Json, callback: (context: TraverseContext) => Promise<Json>): Promise<Json> {
  //   let newData = {...data};

  //   for (const [key, value] of Object.entries(data)) {
  //     // call recursively if there is another object
  //     if (isObject(value)) {
  //       data[key] = await this.traverse(value as Json, callback);
  //     }

  //     newData = await callback({ data, key, value });
  //   }

  //   return newData;
  // }
}