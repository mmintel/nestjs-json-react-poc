import { BlueprintService } from './blueprint.service';
import { Module } from '@nestjs/common';
import { JsonModule } from '../json';

@Module({
  imports: [JsonModule],
  providers: [BlueprintService],
  exports: [BlueprintService]
})
export class BlueprintModule {}
