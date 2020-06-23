import { Logger } from '@nestjs/common';
import { Field, FieldDefinition, FieldDefinitionSchema } from './field';
import Joi from '@hapi/joi';

interface TextFieldDefinition extends FieldDefinition {
  min?: number,
  max?: number,
  trim?: boolean,
  truncate?: boolean,
  uppercase?: boolean,
}

class TextFieldDefinitionError extends Error {}
class TextFieldInitializationError extends Error {}

class TextField implements Field {
  private logger = new Logger('TextField');
  public type = 'text';
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

  public resolve(value: any): Joi.ValidationResult {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    if (!this.schema) {
      throw new TextFieldInitializationError('TextField must be initialized!')
    }

    return this.schema.validate(value);
  }

  private isValidDefinition(definition: FieldDefinition): definition is TextFieldDefinition {
    const { error } = this.definitionSchema.validate(definition);
    if (error) {
      throw new TextFieldDefinitionError(error.message);
    }
    return true;
  }

  private buildFieldSchema(definition: TextFieldDefinition): Joi.Schema {
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

export default new TextField();