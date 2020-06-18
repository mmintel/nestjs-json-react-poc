import { HttpExceptionFilter } from './http-exception.filter';
import {
  Controller,
  Get,
  Render,
  HttpException,
  HttpStatus,
  UseFilters,
  Param,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { JsonService } from '../json';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private pagesPath: string;
  private staticPath: string;

  constructor(
    private jsonService: JsonService,
    private configService: ConfigService
  ) {
    this.pagesPath = this.configService.get<string>('pagesPath') || '';
    this.staticPath = this.configService.get<string>('staticPath') || '';
  }

  @Get('/static/:path*')
  public serveStatic(@Param('path') path: string, @Res() res: Response) {
    return res.sendFile(join(this.staticPath, path));
  }

  @Get()
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showHomePage() {
    const path = join(this.pagesPath, `index`)
    return this.getPage(path);
  }

  @Get(':slug*')
  @Render('page.tsx')
  @UseFilters(HttpExceptionFilter)
  public async showPageBySlug(@Param('slug') slug: string) {
    const path = join(this.pagesPath, `${slug}`);
    return this.getPage(path);
  }

  private async getPage(path: string) {
    const json = await this.jsonService.readFile(path);
    if (!json) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Page was not found',
      }, HttpStatus.NOT_FOUND);
    }
    return json;
  }
}
