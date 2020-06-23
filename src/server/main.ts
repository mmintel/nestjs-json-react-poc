import { RecordModelService } from './modules/record-model';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './modules/app';
import { fields } from './fields';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const recordModelService = app.get(RecordModelService);

  fields.forEach(field => {
    recordModelService.register(field.type, field);
  })

  await register(app);

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
})();
