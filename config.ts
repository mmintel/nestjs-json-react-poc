import { resolve } from 'path';

export default () => ({
  isProduction: process.env.NODE_ENV === 'production',
  pagesPath: resolve(process.cwd(), 'content', 'pages'),
  staticPath: resolve(process.cwd(), 'static'),
});