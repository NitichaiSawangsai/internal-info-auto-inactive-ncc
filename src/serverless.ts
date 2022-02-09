import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { LOGGER_SERVICE } from './app.constants';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get<WinstonLoggerService>(LOGGER_SERVICE));

  await app.listen(3000, '0.0.0.0');
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('event ', event);
  console.log('context ', context);
  console.log('callback ', callback);
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
