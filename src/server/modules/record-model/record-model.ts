import { isObject } from '../../utils/is-object';
import { Blueprint } from '../blueprint';
import { Record } from '../record';
import { Json, AnyJson } from '../json';

interface TraverseContext {
  json: Json,
  key: string,
  value: AnyJson
}

export class RecordModel {
  constructor(private blueprint: Blueprint) {}

  public async buildRecord(record: Record): Promise<Json> {
    console.log('Building record for', record);
    const newRecord = await this.traverse(record, this.applyFields);
    console.log('Built new record', newRecord);
    return newRecord;
  }

  private applyFields = async ({ json, key, value }: TraverseContext): Promise<Json> => {
    console.log('Use', this.blueprint);
    console.log('Apply field to', key, value);
    return json;
  }

  private async traverse(json: Json, callback: (context: TraverseContext) => Promise<Json>): Promise<Json> {
    let newJson = {...json};

    for (const [key, value] of Object.entries(json)) {
      // call recursively if there is another object
      if (isObject(value)) {
        json[key] = await this.traverse(value as Json, callback);
      }

      newJson = await callback({ json, key, value });
    }

    return newJson;
  }
}