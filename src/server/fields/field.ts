import { Services } from '../modules/record';
import { PageService } from '../modules/page';
import { Logger } from '@nestjs/common';
import { AnyJson } from '../modules/json';
import Joi from '@hapi/joi';

export class FieldDefinitionError extends Error {
  name = 'FieldDefinitionError';
}

export class FieldInitializationError extends Error {
  name = 'FieldInitializationError';
}

export class FieldRequiredError extends Error {
  name = 'FieldRequiredError';
}

interface FieldServices extends Services {
  pageService: PageService
}

export interface ResolveFieldContext {
  value: AnyJson,
  services: FieldServices,
  schema: FieldSchema,
}

export abstract class Field<D extends FieldDefinition> {
  public abstract type: string;

  private definition: FieldDefinition | null = null;
  private name = this.constructor.name;

  protected logger = new Logger(this.name);
  protected schema: Joi.Schema | null = null;
  protected services: Services = {};
  protected abstract readonly definitionSchema: Joi.Schema;
  protected abstract resolveField(context: ResolveFieldContext): Promise<AnyJson> | AnyJson;
  protected abstract buildFieldSchema(definition: FieldDefinition): Joi.Schema;

  public init(services: Services, definition: FieldDefinition): void {
    this.logger.verbose(`Initializing with ${JSON.stringify(definition)} ...`)

    this.services.pageService = services.pageService;
    this.definition = definition;

    if (this.isValidDefinition(definition)) {
      this.schema = this.buildFieldSchema(definition);
    }
  }

  public async resolve(value: AnyJson): Promise<AnyJson> {
    this.logger.verbose(`Resolving value: ${JSON.stringify(value)} ...`)

    if (!this.schema || !this.services.pageService || !this.definition) {
      throw new FieldInitializationError(`${this.name} must be initialized!`)
    }

    if (!value && !this.definition.required) {
      return value;
    } else if (!value && this.definition.required) {
      throw new FieldRequiredError(`${this.type} is required!`)
    }

    const context: ResolveFieldContext = {
      value,
      schema: this.schema,
      services: this.services as FieldServices,
    }

    return this.resolveField(context);
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