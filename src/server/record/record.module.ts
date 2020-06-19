import { RecordService } from './record.service';
import { Module } from '@nestjs/common';
import { JsonService } from '../json';
import { FileService } from '../file';

@Module({
  imports: [JsonService, FileService],
  providers: [RecordService]
})
export class RecordModule {}
