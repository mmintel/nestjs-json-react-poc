import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RecordModule } from '../record';
import { RecordModelModule } from '../record-model';
import config from '../../../../config';

@Module({
  imports: [
    RecordModelModule,
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
