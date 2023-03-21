import * as util from 'util';
import { HttpException, Logger } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class UnknownException extends HttpException {
  constructor(
    applicationError: ApplicationException,
    ...args: string[] | number[]
  ) {
    // Logger.error(applicationError, UnknownException.name);

    const { statusCode } = applicationError;
    let { message } = applicationError;
    message = util.format(message, ...args);
    super(
      HttpException.createBody(applicationError, message, statusCode),
      statusCode,
    );
  }
}
