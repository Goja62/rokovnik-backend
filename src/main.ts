import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.slika.destinacija, {
    prefix: StorageConfig.slika.urlPrefix,
    maxAge: StorageConfig.slika.maxAge,
    index: false,
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000);
}
bootstrap();
