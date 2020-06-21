import * as fs from 'fs-extra';
// import fg from 'fast-glob';
import { Injectable, Logger } from '@nestjs/common';

export interface FileMeta {
  createdAt: Date,
  updatedAt: Date,
  dir: boolean,
}

@Injectable()
export class FileService {
  private logger = new Logger('FileService');

  public async readMeta(path: string): Promise<FileMeta> {
    const stats = await fs.lstat(path);
    return {
      dir: stats.isDirectory(),
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    }
  }

  public async readFile(path: string): Promise<string | null> {
    this.logger.verbose(`read file: ${path}`);
    try {
      return fs.readFile(path, 'utf-8');
    } catch (e) {
      this.logger.error(`could not read file: ${path}`, e);
      return null;
    }
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
}
