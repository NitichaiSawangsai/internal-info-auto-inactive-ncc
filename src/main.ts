import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LOGGER_SERVICE } from './app.constants';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get<WinstonLoggerService>(LOGGER_SERVICE));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
