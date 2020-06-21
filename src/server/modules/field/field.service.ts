import { Injectable } from '@nestjs/common';

export type Field = {
  [key: string]: any;
  type: string;
  required?: boolean;
}

interface Fields {
  [key: string]: Field,
}

@Injectable()
export class FieldService {
  private fields: Fields = {}

  public register(type: string, field: Field) {
    this.fields[type] = field;
  }

  public findByType(type: string): Field {
    return this.fields[type];
  }
}