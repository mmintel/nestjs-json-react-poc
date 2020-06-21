import { FieldType, FieldDefinition } from '../field.service';

interface TextFieldTypeInitOptions {
  definition: TextFieldDefinition,
  value: TextFieldValue,
}

type TextFieldValue = string;
type TextFieldDefinition = FieldDefinition;

export class TextFieldType extends FieldType<TextFieldType, TextFieldDefinition, string> {
  private type = 'text';

  constructor() {
    super();
  }

  public init({
    definition,
    value,
  }: TextFieldTypeInitOptions) {
    if (!this.validateValue(value)) {
      throw new Error('Invalid value for text field.');
    }

    this.value = value;
    this.definition = definition;
  }

  public isType(type: unknown): type is TextFieldType {
    return type === this.type;
  }

  private validateValue(value: unknown): value is TextFieldValue {
    return typeof(value) === 'string';
  }

}

export default new TextFieldType();