import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RecordModule } from '../record';
import config from '../../../../config';

@Module({
  imports: [
    RecordModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    })
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
