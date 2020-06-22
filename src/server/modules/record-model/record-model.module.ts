import { Module } from '@nestjs/common';
import { RecordModelService } from './record-model.service';

@Module({
  providers: [
    RecordModelService,
  ],
  exports: [RecordModelService],
})
export class RecordModelModule {}
