import { SchemaValidator, Schema } from '../utils/schema';
import { Field, FieldDefinition } from '../modules/record-model';

interface TextFieldDefinition extends FieldDefinition {
  min?: number
  max?: number
}

const definitionSchema = SchemaValidator.object({
  type: SchemaValidator.string().required(),
  required: SchemaValidator.boolean(),
  min: SchemaValidator.number().integer().min(0),
  max: SchemaValidator.number().integer().min(1),
});

class TextFieldDefinitionError extends Error {}
class TextFieldInitializationError extends Error {}

class TextField implements Field {
  public type = 'text';
  private schema: Schema | null = null;

  public init(definition: FieldDefinition): void {
    if (this.isValidDefinition(definition)) {
      this.schema = this.buildSchema(definition);
    }
  }

  public validate(value: any) {
    if (!this.schema) {
      throw new TextFieldInitializationError('TextField must be initialized!')
    }

    if (!this.isValid(value)) {
      return { value, error: 'Is not a string.' }
    }

    return this.schema.validate(value);
  }

  private isValid(value: any) {
    return typeof value === 'string'
  }

  private isValidDefinition(definition: FieldDefinition): definition is TextFieldDefinition {
    const { error } = definitionSchema.validate(definition);
    if (error) {
      throw new TextFieldDefinitionError(error.message);
    }
    return true;
  }

  private buildSchema(definition: TextFieldDefinition): Schema {
    let schema = SchemaValidator.string();

    if (definition.min) {
      schema = schema.min(definition.min);
    }

    if (definition.max) {
      schema = schema.max(definition.max);
    }

    return schema;
  }
}

export default new TextField();