import React from 'react';
import {
  Document,
  Head,
  Main,
} from '@react-ssr/nestjs-express';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>react-ssr-nestjs-starter</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/turbolinks/5.2.0/turbolinks.js"></script>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
};
