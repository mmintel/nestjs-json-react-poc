import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { JsonModule } from '../json';
import config from '../../../config';

@Module({
  imports: [
    JsonModule,
    ConfigModule.forRoot({
      load: [config]
    })
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
