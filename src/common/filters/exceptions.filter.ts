import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ValidationFilter implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    response.status(400).json({
      code: 400,
      errors: exception.errors,
    });
  }
}

// @Catch()
// export class ExceptionsFilter extends BaseExceptionFilter {
//   private readonly logger: Logger = new Logger();

//   public override catch(exception: unknown, host: ArgumentsHost): void {
//     let args: unknown;

//     const status = this.getHttpStatus(exception);
//     if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
//       if (exception instanceof Error) {
//         this.logger.error({ err: exception, args });
//       } else {
//         // Error Notifications
//         this.logger.error('UnhandledException', exception);
//       }
//     }
//   }

//   private getHttpStatus(exception: unknown): HttpStatus {
//     return exception instanceof HttpException
//       ? exception.getStatus()
//       : HttpStatus.INTERNAL_SERVER_ERROR;
//   }
// }
