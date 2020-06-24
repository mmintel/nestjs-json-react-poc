import { Field, FieldDefinition, FieldDefinitionSchema, FieldSchema } from './field';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

interface TextFieldDefinition extends FieldDefinition {
  min?: number,
  max?: number,
  trim?: boolean,
  truncate?: boolean,
  uppercase?: boolean,
}

class TextFieldValidationError extends Error {}

export class TextField extends Field<TextFieldDefinition> {
  public type = 'text';
  protected readonly definitionSchema = new FieldDefinitionSchema({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(1),
    trim: Joi.boolean(),
    truncate: Joi.boolean(),
    uppercase: Joi.boolean(),
  }).schema;

  public async resolveField(value: AnyJson, schema: FieldSchema): Promise<AnyJson> {
    try {
      return schema.validateAsync(value);
    } catch(e) {
      throw new TextFieldValidationError(e.message);
    }
  }

  protected buildFieldSchema(definition: TextFieldDefinition): Joi.Schema {
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