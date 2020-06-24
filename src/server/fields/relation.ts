import { Field, FieldDefinition, FieldSchema, FieldDefinitionSchema } from './field';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

type RelationFieldDefinition = FieldDefinition
class RelationFieldValidationError extends Error {}

export class RelationField extends Field<RelationFieldDefinition> {
  public type = 'relation';
  protected readonly definitionSchema = new FieldDefinitionSchema().schema;

  protected async resolveField(value: AnyJson, schema: FieldSchema): Promise<AnyJson> {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    try {
      return schema.validateAsync(value);
    } catch(e) {
      throw new RelationFieldValidationError(e.message);
    }
  }

  protected buildFieldSchema(definition: RelationFieldDefinition): Joi.Schema {
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