import { Field, FieldDefinition, FieldSchema, FieldDefinitionSchema, ResolveFieldContext } from './field';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

type RelationFieldDefinition = FieldDefinition
class RelationFieldValidationError extends Error {
  name = 'RelationFieldValidationError';
}

export class RelationField extends Field<RelationFieldDefinition> {
  public type = 'relation';

  protected getFieldDefinitionSchema(): FieldDefinitionSchema {
    return new FieldDefinitionSchema({
      multiple: Joi.boolean(),
    })
  };

  protected async resolveField({ value, schema, services }: ResolveFieldContext): Promise<AnyJson> {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    try {
      const normalizedValue = await schema.validateAsync(value);
      return services.pageService.getPage(normalizedValue);
    } catch(e) {
      throw new RelationFieldValidationError(e.message);
    }
  }

  protected buildFieldSchema(definition: RelationFieldDefinition): FieldSchema {
    let schema: FieldSchema;

    const relativePath = /(\/\w+)+$/;
    const dependencyPath = Joi.string().pattern(relativePath);

    if (definition.multiple) {
      schema = Joi.array().items(dependencyPath)
    } else {
      schema = dependencyPath;
    }

    return schema;
  }
}