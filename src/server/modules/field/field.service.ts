import { isObject } from '../../utils/is-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AnyJson } from '../json';

export interface FieldDefinition {
  type: string
}

interface FieldTypeInitOptions<D,V> {
  definition: D,
  value: V,
}

interface CreateFieldType {
  definition: FieldDefinition,
  value: any
}

export abstract class FieldType<T,D extends FieldDefinition,V> {
  protected value: V | null = null;
  protected definition: D | null = null;

  public abstract init(options: FieldTypeInitOptions<D,V>): void | Promise<void>;
  public abstract isType(type: unknown): type is T;
  public abstract serialize(): AnyJson;
}

@Injectable()
export class FieldService {
  private logger = new Logger('FieldService');

  constructor(@Inject('FIELD_TYPES') private fieldTypes: FieldType<any, FieldDefinition, AnyJson>[]) {
  }

  public static isValidFieldDefinition(value: unknown): value is FieldDefinition {
    if (!isObject(value)) return false;
    return  Object.prototype.hasOwnProperty.call(value, "type");
  }

  public create({
    definition,
    value
  }: CreateFieldType): FieldType<any, FieldDefinition, AnyJson> {
    const fieldType = this.findType(definition.type);

    if (!fieldType) {
      throw new Error(`Field Type "${definition.type}" not found.`)
    }

    fieldType.init({
      definition,
      value
    })

    return fieldType;
  }

  private findType (type: string) {
    const fieldType = this.fieldTypes.find((f: any) => f.isType(type));
    return fieldType
  }
}
