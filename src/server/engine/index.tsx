import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NestExpressApplication } from '@nestjs/platform-express';
import Helmet from 'react-helmet';

export class Engine {
  private async render(
    file: string,
    options: any,
    cb: (err: any, html?: any) => void,
  ): Promise<void> {
    const { Page } = await import(file);
    const optionsBlacklist = ['settings', 'locals', '_cache'];

    const props = Object.fromEntries(
      Object.entries(options).filter(
        ([key]) => !optionsBlacklist.includes(key),
      ),
    );

    try {
      const element = React.createElement(Page, props as any);
      const helmet = Helmet.renderStatic();
      const html = /*html*/ `
        <!doctype html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <div id="content">
                  ${renderToStaticMarkup(element)}
                </div>
            </body>
        </html>
      `;
      cb(null, html);
    } catch (e) {
      cb(e);
    }
  }

  public register(app: NestExpressApplication) {
    const expressApp = app.getHttpAdapter().getInstance();

    expressApp.engine('tsx', this.render);

    expressApp.set('views', './src/views'); // specify the views directory
    expressApp.set('view engine', 'tsx'); // register the template engine
  }
}
