import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { BaseController } from '../base';
import { ERROR } from '../enums/error.enum';

@Catch()
export class AllExceptionsFilter
  extends BaseController
  implements ExceptionFilter
{
  constructor() {
    super(ERROR);
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    const { errorCode, message } = this.messageCode(exception);

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
      currentTime: new Date().getTime(),
    });
  }
}
