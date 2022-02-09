import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { LOGGER_SERVICE } from './app.constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodKey = context.getHandler().name;
    const type = context.getType();
    const processId = uuidv1();
    let args = {};
    if (type === 'http') {
      const { params, body, headers, query, url, method } = context
        .switchToHttp()
        .getRequest();
      args = {
        ...args,
        url,
        method,
        headers,
        query,
        params,
        body,
      };
    }
    const executionContext = `${className}.${methodKey}`;
    this.logger.log('begin executing function', executionContext, {
      processId,
      args,
    });

    const now = Date.now();
    return next.handle().pipe(
      tap((returnValue) =>
        this.logger.log('done executing function', executionContext, {
          processId,
          elapsedTime: Date.now() - now,
          returnValue,
        }),
      ),
      catchError((err: Error) => {
        this.logger.error(err.message, err.stack, executionContext, {
          processId,
        });
        throw err;
      }),
    );
  }
}
