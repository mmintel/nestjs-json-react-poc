import { Logger } from '@nestjs/common';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

// export interface Field {
//   type: string;
//   init: (definition: FieldDefinition) => void,
//   resolve: (value: AnyJson) => Promise<AnyJson>|AnyJson,
// }
export class FieldDefinitionError extends Error {}
export class FieldInitializationError extends Error {}

export abstract class Field<D extends FieldDefinition> {
  public abstract type: string;

  protected logger = new Logger(this.constructor.name);
  protected schema: Joi.Schema | null = null;
  protected abstract readonly definitionSchema: Joi.Schema;
  protected abstract resolveField(value: AnyJson, schema: Joi.Schema): Promise<AnyJson> | AnyJson;
  protected abstract buildFieldSchema(definition: FieldDefinition): Joi.Schema;

  public init(definition: FieldDefinition): void {
    this.logger.verbose(`Initializing with ${JSON.stringify(definition)} ...`)

    if (this.isValidDefinition(definition)) {
      this.schema = this.buildFieldSchema(definition);
    }
  }

  public async resolve(value: AnyJson): Promise<AnyJson> {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    if (!this.schema) {
      throw new FieldInitializationError(`${this.constructor.name} must be initialized!`)
    }

    return this.resolveField(value, this.schema);
  }

  private isValidDefinition(definition: FieldDefinition): definition is D {
    const { error } = this.definitionSchema.validate(definition);
    if (error) {
      throw new FieldDefinitionError(error.message);
    }
    return true;
  }
}

export type FieldSchema = Joi.Schema;

export interface FieldDefinition {
  [key: string]: any,
  type: string
}

export class FieldDefinitionSchema {
  private baseSchema: Joi.SchemaMap<any> = {
    type: Joi.string().required(),
    required: Joi.boolean(),
  }
  private fieldSchema: Joi.SchemaMap<any> = {}

  constructor(fieldSchema?: Joi.SchemaMap<any>) {
    if (fieldSchema) {
      this.fieldSchema = fieldSchema;
    }
  }

  public get schema(): Joi.ObjectSchema<any> {
    return Joi.object({
      ...this.baseSchema,
      ...this.fieldSchema,
    });
  }
}