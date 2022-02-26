import { Module } from '@nestjs/common';
import { StoreService } from './store.service';

@Module({
  imports: [],
  exports: [StoreService],
  providers: [StoreService]
})
export class StoreModule {
  constructor(private storeService: StoreService) {
    StoreService.Instance = this.storeService;
  }
  getState = () => { return this.storeService.getState(); }
}
