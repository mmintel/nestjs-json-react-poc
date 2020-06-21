import { RecordService } from './record.service';
import { Module } from '@nestjs/common';
import { JsonModule } from '../json';
import { BlueprintModule } from '../blueprint';
import { FieldModule } from '../field';

@Module({
  imports: [JsonModule, BlueprintModule, FieldModule],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
