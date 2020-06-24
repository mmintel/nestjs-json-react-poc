import { Logger } from '@nestjs/common';
import { Field, FieldDefinition } from '../../fields/field';
import { Blueprint } from '../blueprint';
import { Services } from '../record';
import { Json } from '../json';
import { RecordModelService } from './record-model.service';

interface InitializedFieldRegistry {
  [key: string]: Field<any>,
}

export class ResolveFieldError extends Error {
  name = 'ResolveFieldError';
}

export class InitFieldError extends Error {
  name = 'InitFieldError';
}

export class MissingFieldError extends Error {
  name = 'MissingFieldError';
}

export class InvalidFieldDefinitionError extends Error {
  name = 'InvalidFieldDefinitionError';
}

export class RecordModel {
  private logger = new Logger('RecordModel');
  private fields: InitializedFieldRegistry = {};

  constructor(
    private recordModelService: RecordModelService,
    private services: Services,
    private blueprint: Blueprint
  ) {
  }

  public async init() {
    this.logger.verbose(`Initializing with ${JSON.stringify(this.blueprint)}...`);

    await this.walkBlueprint(async (key, definition) => {
      const type = definition.type;
      const field = this.recordModelService.findByType(type);
      const fieldName = field.constructor.name;

      if (!field) {
        throw new MissingFieldError(`Could not find field for type "${type}".`);
      }

      try {
        field.init(this.services, definition);
      } catch(e) {
        throw new InitFieldError(`Error initializing "${fieldName}" with "${JSON.stringify(definition)}": ${e.message}.`)
      }

      this.fields[key] = field;
    });

    this.logger.verbose(`Registered fields: ${Object.keys(this.fields)}!`);
  }

  public async build(record: Json): Promise<Json> {
    this.logger.verbose(`Building record for ${JSON.stringify(record)}...`);
    const newRecord = {...record};

    for (const [key, field] of Object.entries(this.fields)) {
      const value = record[key];
      try {
        newRecord[key] = await field.resolve(value)
      } catch (error) {
        throw new ResolveFieldError(`Error resolving Field with type "${field.type}" of "${JSON.stringify(value)}": ${error.message}.`);
      }
    }

    this.logger.verbose(`Built new record ${JSON.stringify(newRecord)}`);
    return newRecord;
  }

  private isValidFieldDefinition(definition: unknown): definition is FieldDefinition {
    return  Object.prototype.hasOwnProperty.call(definition, "type");
  }

  private async walkBlueprint(callback: (key: string, definition: FieldDefinition) => Promise<void>) {
    for (const [key, definition] of Object.entries(this.blueprint)) {
      if (!this.isValidFieldDefinition(definition)) {
        throw new InvalidFieldDefinitionError('Provided definition does not have a type property.');
      }

      await callback(key, definition);
    }
  }
}