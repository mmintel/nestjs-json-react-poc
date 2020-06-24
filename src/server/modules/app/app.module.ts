import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PageModule } from '../page';
import { RecordModelModule } from '../record-model';
import config from '../../../../config';

@Module({
  imports: [
    RecordModelModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    PageModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
