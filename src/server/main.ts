import { RecordModelService } from './modules/record-model';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app';
import { fields } from './fields';
import { Engine } from './engine';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const recordModelService = app.get(RecordModelService);
  const engine = new Engine();

  for (const [type, field] of Object.entries(fields)) {
    recordModelService.register(type, field);
  }

  engine.register(app);

  app.listen(3000, async () => {
    console.log(`> Ready on http://localhost:3000`);
  });
})();
