import { isObject } from '../../utils/is-object';
import { extname } from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Storage } from '../../storage';

export type AnyJson = boolean | number | string | null | JsonArray | Json;
export type JsonArray = Array<AnyJson>;
export interface Json {
  [key: string]: AnyJson;
}

interface TraverseContext {
  json: Json,
  key: string,
  value: AnyJson
}

export class JsonNotFoundError extends Error {}

@Injectable()
export class JsonService {
  private logger = new Logger('JsonService');

  constructor(
    @Inject('Storage') private storage: Storage,
  ) {}

  public async getOne(path: string): Promise<Json> {
    const id = this.buildIdentifier(path);

    try {
      const data = await this.storage.getOne(id);
      return this.parse(data);
    } catch {
      throw new JsonNotFoundError('')
    }
  }

  public async traverse(json: Json, callback: (context: TraverseContext) => Promise<Json>): Promise<Json> {
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

  private parse(data: string): Json {
    const json = JSON.parse(data);
    return json;
  }

  // async list(path: string, recursive = false): Promise<Array<string>> {
  //   this.logger.verbose(`list dir: ${path}`);
  //   if (recursive) {
  //     return fg(`${path}/**/*.json`);
  //   }

  //   return fg(`${path}/*.json`);
  // }

  // async readDir<T>(path: string, recursive = false): Promise<Array<T>> {
  //   this.logger.verbose(`read dir: ${path}`);
  //   const dir = await this.list(path, recursive);
  //   return Promise.all(
  //     dir.map(async (fileName: string) => {
  //       return this.readFile<any>(fileName);
  //     }),
  //   );
  // }

  private buildIdentifier(path: string) {
    let jsonPath = path;
    const json = '.json';
    const ext = extname(path);

    if (ext === '') {
      jsonPath = `${path}${json}`;
    } else if (ext !== json) {
      jsonPath = jsonPath.replace(ext, json);
    }

    return jsonPath;
  }
}