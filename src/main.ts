import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LOGGER_SERVICE } from './app.constants';
import { AppModule } from './app.module';
import serverConfig from './config/server.config';
import { WinstonLoggerService } from './logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const svConfig: ConfigType<typeof serverConfig> = app.get(serverConfig.KEY);
  // app.useLogger(app.get<WinstonLoggerService>(LOGGER_SERVICE));

  await app.listen(svConfig.port, '0.0.0.0');
}
bootstrap();
