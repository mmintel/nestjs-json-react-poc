import { Module } from '@nestjs/common';
import { JsonService } from './json.service';
import { FileStorage } from '../../storage';
@Module({
  providers: [
    JsonService,
    {
      provide: 'Storage',
      useClass: FileStorage
    }
  ],
  exports: [JsonService],
})
export class JsonModule {}
