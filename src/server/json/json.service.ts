import { extname } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { FileService } from '../file';

export type AnyJson = boolean | number | string | null | JsonArray | Json;
export type JsonArray = Array<AnyJson>;
export interface Json {
  [key: string]: AnyJson;
}

@Injectable()
export class JsonService {
  private logger = new Logger('JsonService');

  constructor(
    private fileService: FileService,
  ) {}

  public async get(path: string): Promise<Json | null> {
    const jsonPath = this.ensureJson(path);
    return this.readJson(jsonPath);
  }

  public static async traverse(json: Json, callback: (json: Json, key: string, value: AnyJson) => Promise<Json>): Promise<Json> {
    let newJson = {...json};

    for (const [key, value] of Object.entries(json)) {
      // call recursively if there is another object
      if (JsonService.isObject(value)) {
        json[key] = await JsonService.traverse(value as Json, callback);
      }

      newJson = await callback(json, key, value);
    }

    return newJson;
  }

  private async readJson(path: string): Promise<Json | null> {
    const data = await this.fileService.readFile(path);
    if (!data) return null;
    const json = JSON.parse(data);
    return json;
  }

  private static isObject(value: AnyJson) {
    return value === Object(value);
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

  private ensureJson(path: string) {
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
