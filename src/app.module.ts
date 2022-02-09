import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import serverConfig from './config/server.config';
import elasticsearchConfig from './config/elasticsearch.config';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import awsConfig from './config/aws.config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggerModule } from './logger/logger.module';
import { InternalInfoModule } from './internal-info/internal-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        serverConfig,
        databaseConfig,
        elasticsearchConfig,
        apiConfig,
        awsConfig,
      ],
      cache: true,
      validationSchema: Joi.object({
        SERVER_PORT: Joi.number().port().label('port server').required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().label('port database').required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_SYNC: Joi.string().default('disable'),
        DATABASE_TYPE: Joi.string().default('postgres'),
        DATABASE_SCHEMA: Joi.string().required(),
        ELASTICSEARCH_URL: Joi.string()
          .uri()
          .label('url elasticsearch')
          .required(),
        ELASTICSEARCH_PREFIX: Joi.string()
          .label('prefix elasticsearch')
          .required(),
        REGION: Joi.string().label('aws region').required(),
        ACCESS_KEY_ID: Joi.string().label('aws access key id').required(),
        SECRET_ACCESS_KEY: Joi.string()
          .label('aws secret access key')
          .required(),
        CLOUD_WATCH_LOG_GROUP: Joi.string()
          .label('aws cloud watch log group')
          .required(),
        CLOUD_WATCH_LOG_STREAM: Joi.string()
          .label('aws cloud watch log stream')
          .required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        schema: configService.get('database.schema'),
        autoLoadEntities: true,
        synchronize: configService.get('database.syncEnabled') === 'enable',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    // LoggerModule,
    InternalInfoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}
