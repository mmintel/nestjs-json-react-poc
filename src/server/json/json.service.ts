import * as fs from 'fs-extra';
import fg from 'fast-glob';
import { extname } from 'path';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JsonService {
  private logger = new Logger('JsonService');

  async readFile<T>(path: string): Promise<T|null> {
    this.logger.verbose(`read file: ${path}`);
    const json = this.ensureJson(path);
    try {
      return await fs.readJson(json);
    } catch {
      this.logger.warn(`could not read file: ${path}`);
      return null;
    }
  }

  async list(path: string, recursive = false): Promise<Array<string>> {
    this.logger.verbose(`list dir: ${path}`);
    if (recursive) {
      return fg(`${path}/**/*.json`);
    }

    return fg(`${path}/*.json`);
  }

  async readDir<T>(path: string, recursive = false): Promise<Array<T>> {
    this.logger.verbose(`read dir: ${path}`);
    const dir = await this.list(path, recursive);
    return Promise.all(
      dir.map(async (fileName: string) => {
        return this.readFile<any>(fileName);
      }),
    );
  }

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
