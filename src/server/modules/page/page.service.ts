import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Json } from '../json';
import { RecordService, BuildRecordException, RecordNotFoundException } from '../record';

export type Page = Json

export class BuildPageException extends Error {
  name = 'BuildPageException'
}

export class PageNotFoundException extends Error {
  name = 'PageNotFoundException'
}

export class UnknownPageException extends Error {
  name = 'UnknownPageException'
}

@Injectable()
export class PageService {
  private pagesDir: string;

  constructor(
    private recordService: RecordService,
    private configService: ConfigService,
  ) {
    this.pagesDir = this.configService.get<string>('pagesDir') || 'pages';
  }

  async getPage(path: string) {
    try {
      const record = await this.recordService.getRecord(join(this.pagesDir, path));
      return record.init({ pageService: this });
    } catch (e) {
      switch(e.constructor) {
        case BuildRecordException:
          throw new BuildPageException(e.message);
        case RecordNotFoundException:
          throw new PageNotFoundException(e.message);
        default:
          throw new UnknownPageException(e.message);
      }
    }
  }
}