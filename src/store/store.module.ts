import { Module } from '@nestjs/common';
import { DataService } from './store.service';

@Module({
  imports: [],
  exports: [DataService],
  providers: [DataService]
})
export class DataModule {}
