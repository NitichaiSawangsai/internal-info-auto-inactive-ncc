import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import awsConfig from '../config/aws.config';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(
    @Inject(awsConfig.KEY)
    private readonly aws: ConfigType<typeof awsConfig>,
  ) {
    this.logger = winston.createLogger({
      defaultMeta: {
        service: 'internal-info-auto-inactive-api',
      },
      format: winston.format.timestamp(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(
              'internal-info-auto-inactive-api',
            ),
          ),
        }),
        new WinstonCloudWatch({
          awsAccessKeyId: aws.accessKeyId,
          awsSecretKey: aws.secretAccessKey,
          awsRegion: aws.region,
          logGroupName: aws.cloudWatch.logGroup,
          logStreamName: aws.cloudWatch.logStream,
          jsonMessage: true,
          name: null,
        }),
      ],
    });
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): any {
    this.logger.error(message, {
      context,
      stackTrace: trace,
      ...meta,
    });
  }

  log(message: any, context?: string, meta?: Record<string, unknown>): any {
    if (this.aws.cloudWatch.show === 'enable') {
      if (meta?.args?.['method']) {
        this.logger.info(message, {
          context,
          host: meta?.args?.['headers']?.['host'] || null,
          url: meta?.args?.['url'] || null,
          method: meta?.args?.['method'] || null,
          processId: meta?.processId || null,
          elapsedTime: meta?.elapsedTime || null,
          payload: {
            query: meta?.args?.['query'] || null,
            params: meta?.args?.['params'] || null,
            body: meta?.args?.['body'] || null,
          },
        });
      } else if (meta?.returnValue) {
        let returnValue = meta?.returnValue || null;
        if (Array.isArray(returnValue)) {
          returnValue = {
            total: returnValue?.length || 0,
            data: returnValue?.slice(0, 5),
          };
        }
        this.logger.info(message, {
          context,
          elapsedTime: meta?.elapsedTime || null,
          returnValue,
        });
      } else {
        this.logger.info(message, { context, ...meta });
      }
    }
  }

  warn(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logger.verbose(message, { context, ...meta });
  }
}
