import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface Exception {
  status: number,
  error: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Exception;

    response
      .status(status)
      .render('error.tsx', {
        statusCode: status,
        message: exceptionResponse.error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}