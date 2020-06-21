import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './modules/app';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await register(app);

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
})();
