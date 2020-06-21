import { FieldDefinition, FieldType } from "../field.service";
import Joi from '@hapi/joi';

enum SORT_ENUM {
  UPDATED_AT = "updated_at",
  CREATED_AT = "updated_at"
}

interface RelationFieldDefinition extends FieldDefinition {
  multiple?: boolean,
  max?: number,
  sort?: SORT_ENUM,
}

interface RelationFieldTypeInitOptions {
  definition: RelationFieldDefinition,
  value: RelationFieldValue,
}

type RelationFieldValue = string;

const definitionSchema = Joi.object({
  type: Joi.string(),
  multiple: Joi.boolean,
  max: Joi.number,
  sort: Joi.string().valid(SORT_ENUM)
})

export class RelationFieldType extends FieldType<RelationFieldType, RelationFieldDefinition, string> {
  private type = 'relation';

  constructor() {
    super();
  }

  public init({
    definition,
    value,
  }: RelationFieldTypeInitOptions) {
    this.definition = this.validateDefinition(definition);
    this.value = this.validateValue(value);
  }

  public isType(type: unknown): type is RelationFieldType {
    return type === this.type;
  }

  public serialize() {
    return {}
  }

  private validateValue(value: any): RelationFieldValue {
    if (!this.isValid(value)) {
      throw new Error(`Invalid value for relation field: ${value}`);
    }

    return value;
  }

  private isValid(value: unknown): value is RelationFieldValue {
    const relativePath = /(\/\w+)+$/;
    return typeof value === 'string' && relativePath.test(value);
  }

  private validateDefinition(definition: FieldDefinition): RelationFieldDefinition {
    const { error, value } = definitionSchema.validate(definition);

    if (error) {
      throw new Error(`Invalid definition for relation field: ${error.message}`);
    }

    return value as RelationFieldDefinition;
  }
}

export default new RelationFieldType();