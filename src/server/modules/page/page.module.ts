import { Module } from '@nestjs/common';
import { RecordModule } from '../record';
import { PageService } from './page.service'

@Module({
  imports: [RecordModule],
  providers: [PageService],
  exports: [PageService]
})
export class PageModule {}
