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
import { resolve } from 'path';
import { PageService, Page, PageNotFoundException, BuildPageException } from '../page';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private logger = new Logger('AppController');
  private staticPath: string;

  constructor(
    private pageService: PageService,
    private configService: ConfigService,
  ) {
    this.staticPath = this.configService.get<string>('staticPath') || '';
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
      return this.getPage('index');
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
    return this.getPage(slug);
  }

  private async getPage(path: string): Promise<Page> {
    try {
      const data = await this.pageService.getPage(path);
      this.logger.verbose(`Received data ${JSON.stringify(data)}`);
      return data;
    } catch (e) {
      switch(e.constructor) {
        case BuildPageException:
          this.logger.error(e.message);
          throw new UnprocessableEntityException(e.message);
        case PageNotFoundException:
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
