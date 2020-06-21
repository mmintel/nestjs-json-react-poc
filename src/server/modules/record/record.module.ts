import { RecordService } from './record.service';
import { Module } from '@nestjs/common';
import { JsonModule } from '../json';

@Module({
  imports: [JsonModule],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
