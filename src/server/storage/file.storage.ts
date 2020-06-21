import { Storage } from '.';
import * as fs from 'fs-extra';
import fg from 'fast-glob';
import { Injectable, Logger } from '@nestjs/common';

export class FileNotFoundException extends Error {}

@Injectable()
export class FileStorage implements Storage {
  private logger = new Logger('FileStorage');

  public async getOne(path: string): Promise<string> {
    this.logger.verbose(`read file: ${path}`);
    try {
      return fs.readFile(path, 'utf-8');
    } catch (e) {
      throw new FileNotFoundException(`Could not read file: ${path}.`);
    }
  }

  public async getMany(path: string, recursive = false): Promise<string[]> {
    this.logger.verbose(`read dir: ${path}`);
    const dir = await this.list(path, recursive);
    return Promise.all(
      dir.map(async (fileName: string) => {
        return this.getOne(fileName);
      }),
    );
  }

  private async list(path: string, recursive = false): Promise<Array<string>> {
    this.logger.verbose(`list dir: ${path}`);
    if (recursive) {
      return fg(`${path}/**/*.json`);
    }

    return fg(`${path}/*.json`);
  }
}
