import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const globalPrefix = 'api';
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://localhost:6379',
  //   },
  // });
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const config = app.get(ConfigService);

  // APP MAIN LISTENER
  const network = config.get('config.network');
  const port = config.get(['http', network, 'port'].join('.')) || 3333;
  await app.listen(port, () => {
    Logger.log(`Listening at: ${port}/${globalPrefix}`);
  });
}

bootstrap();
