import { Logger } from '@nestjs/common';
import { Field, FieldDefinition, FieldDefinitionSchema } from './field';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

interface RelationFieldDefinition extends FieldDefinition {
  min?: number,
  max?: number,
  trim?: boolean,
  truncate?: boolean,
  uppercase?: boolean,
}

class RelationFieldDefinitionError extends Error {}
class RelationFieldInitializationError extends Error {}
class RelationFieldValidationError extends Error {}

export class RelationField implements Field {
  private logger = new Logger('RelationField');
  public type = 'relation';
  private schema: Joi.Schema | null = null;
  private readonly definitionSchema = new FieldDefinitionSchema({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(1),
    trim: Joi.boolean(),
    truncate: Joi.boolean(),
    uppercase: Joi.boolean(),
  }).schema;

  public init(definition: FieldDefinition): void {
    this.logger.verbose(`Initializing with ${JSON.stringify(definition)} ...`)

    if (this.isValidDefinition(definition)) {
      this.schema = this.buildFieldSchema(definition);
    }
  }

  public async resolve(value: AnyJson): Promise<AnyJson> {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    if (!this.schema) {
      throw new RelationFieldInitializationError('RelationField must be initialized!')
    }

    try {
      return this.schema.validateAsync(value);
    } catch(e) {
      throw new RelationFieldValidationError(e.message);
    }
  }

  private isValidDefinition(definition: FieldDefinition): definition is RelationFieldDefinition {
    const { error } = this.definitionSchema.validate(definition);
    if (error) {
      throw new RelationFieldDefinitionError(error.message);
    }
    return true;
  }

  private buildFieldSchema(definition: RelationFieldDefinition): Joi.Schema {
    let schema = Joi.string();

    if (definition.required) {
      schema = schema.required();
    }

    if (definition.min) {
      schema = schema.min(definition.min);
    }

    if (definition.max) {
      schema = schema.max(definition.max);
    }

    if (definition.trim) {
      schema = schema.trim(definition.trim);
    }

    if (definition.truncate) {
      schema = schema.truncate(definition.truncate);
    }

    if (definition.uppercase) {
      schema = schema.uppercase();
    }

    return schema;
  }
}