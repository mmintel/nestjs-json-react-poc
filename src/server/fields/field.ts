import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

export interface Field {
  type: string;
  init: (definition: FieldDefinition) => void,
  resolve: (value: AnyJson) => Promise<AnyJson>|AnyJson,
}

export interface FieldDefinition {
  [key: string]: any,
  type: string
}

export class FieldDefinitionSchema {
  private baseSchema: Joi.SchemaMap<any> = {
    type: Joi.string().required(),
    required: Joi.boolean(),
  }

  constructor(private fieldSchema: Joi.SchemaMap<any>) {
  }

  public get schema(): Joi.ObjectSchema<any> {
    return Joi.object({
      ...this.baseSchema,
      ...this.fieldSchema,
    });
  }
}