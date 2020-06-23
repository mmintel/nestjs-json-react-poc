import { RecordNotFoundException } from './../record/record.service';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  Controller,
  Get,
  Render,
  UseFilters,
  Param,
  Res,
  InternalServerErrorException,
  HttpException,
  UnprocessableEntityException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { join, resolve } from 'path';
import { RecordService, Record, BuildRecordException } from '../record';
import { ConfigService } from '@nestjs/config';

// TODO Should not use RecordService directly.

@Controller()
export class AppController {
  private logger = new Logger('AppController');
  private staticPath: string;
  private pagesDir: string;

  constructor(
    private recordService: RecordService,
    private configService: ConfigService,
  ) {
    this.staticPath = this.configService.get<string>('staticPath') || '';
    this.pagesDir = this.configService.get<string>('pagesDir') || '';
  }

  @Get(':filename.:ext')
  public serveStatic(
    @Param('filename') filename: string,
    @Param('ext') ext: string,
    @Res() res: Response
  ) {
    this.logger.verbose(`Incoming request for static file with name "${filename}" and extension "${ext}".`)
    const filePath = resolve(this.staticPath, `${filename}.${ext}`);
    this.logger.verbose(`Sending static file at ${filePath}!`);
    return res.sendFile(filePath);
  }

  @Get()
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showHomePage() {
    this.logger.verbose(`Incoming request to show home page.`)
    try {
      return this.getData('index');
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Requested data was not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':slug*')
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showPageBySlug(@Param('slug') slug: string) {
    this.logger.verbose(`Incoming request to show page by slug with ${slug}.`)
    return this.getData(slug);
  }

  private async getData(path: string): Promise<Record> {
    try {
      const data = await this.recordService.get(join(this.pagesDir, path));
      this.logger.verbose(`Received data ${JSON.stringify(data)}`);
      return data;
    } catch (e) {
      switch(e.constructor) {
        case BuildRecordException:
          this.logger.error(e.message);
          throw new UnprocessableEntityException(e.message);
        case RecordNotFoundException:
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'Requested data was not found.',
            },
            HttpStatus.NOT_FOUND,
          );
        default:
          this.logger.error(e.message);
          throw new InternalServerErrorException('Ooops something went wrong.');
      }
    }
  }
}
