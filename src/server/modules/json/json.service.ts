import { extname } from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Storage } from '../../storage';

export type AnyJson = boolean | number | string | null | JsonArray | Json;
export type JsonArray = Array<AnyJson>;
export interface Json {
  [key: string]: AnyJson;
}

export class JsonNotFoundError extends Error {}

@Injectable()
export class JsonService {
  private logger = new Logger('JsonService');

  constructor(
    @Inject('Storage') private storage: Storage,
  ) {}

  public async load(path: string): Promise<Json> {
    const id = this.buildIdentifier(path);

    this.logger.verbose(`Loading JSON at ${id}...`);

    try {
      const data = await this.storage.getOne(id);

      this.logger.verbose(`Received json at ${path}!`)

      return this.parse(data);
    } catch {
      throw new JsonNotFoundError(`Could not receive json data at "${id}".`)
    }
  }

  private parse(data: string): Json {
    const json = JSON.parse(data);
    return json;
  }

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
