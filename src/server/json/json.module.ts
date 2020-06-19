import { Module } from '@nestjs/common';
import { FileModule } from '../file';
import { JsonService } from './json.service';

@Module({
  imports: [FileModule],
  providers: [JsonService],
  exports: [JsonService],
})
export class JsonModule {}
