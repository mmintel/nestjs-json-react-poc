import { RecordService } from './record.service';
import { Module } from '@nestjs/common';
import { JsonModule } from '../json';
import { BlueprintModule } from '../blueprint';
import { RecordModelModule } from '../record-model';

@Module({
  imports: [JsonModule, RecordModelModule, BlueprintModule],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
