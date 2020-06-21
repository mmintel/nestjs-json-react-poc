import { resolve } from 'path';

export default () => ({
  isProduction: process.env.NODE_ENV === 'production',
  staticPath: resolve(process.cwd(), 'data', 'static'),
  contentPath: resolve(process.cwd(), 'data', 'content'),
  blueprintsPath: resolve(process.cwd(), 'data', 'blueprints'),
  pagesDir: 'pages',
});