import { HttpExceptionFilter } from './http-exception.filter';
import {
  Controller,
  Get,
  Render,
  UseFilters,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join, resolve } from 'path';
import { RecordService } from '../record';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
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
    return res.sendFile(resolve(this.staticPath, `${filename}.${ext}`));
  }

  @Get()
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showHomePage() {
    return this.recordService.get(join(this.pagesDir, 'index'));
  }

  @Get(':slug*')
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showPageBySlug(@Param('slug') slug: string) {
    return this.recordService.get(join(this.pagesDir, slug));
  }
}
