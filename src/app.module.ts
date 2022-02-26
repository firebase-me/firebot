import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { StoreModule} from './store/store.module'
import { UtilsService } from './utils/utils.service';
// import rn from 'random-number';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    StoreModule,
    UtilsService
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
