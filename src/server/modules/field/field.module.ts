import { fieldTypes } from './fields';
import { FieldService } from './field.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    FieldService,
    {
      provide: 'FIELD_TYPES',
      useValue: fieldTypes,
    }
  ],
  exports: [FieldService]
})
export class FieldModule {}
