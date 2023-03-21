import { Injectable, NestMiddleware } from '@nestjs/common';
import { yellow, green, red, blue, gray } from 'chalk';
import { Request, Response, NextFunction } from 'express';
import { HTTP_METHOD } from '../enums';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('close', () => {
      const { statusCode } = res;
      const logMethod =
        req.method === HTTP_METHOD.GET
          ? green(req.method)
          : req.method === HTTP_METHOD.POST
          ? yellow(req.method)
          : req.method === HTTP_METHOD.PUT
          ? blue(req.method)
          : req.method === HTTP_METHOD.DELETE
          ? red(req.method)
          : gray(req.method);

      console.log(
        `[${logMethod}]  ${
          statusCode === 200 ? green(statusCode) : red(statusCode)
        }  ${yellow(req.originalUrl)}  ${req.get('user-agent') || ''}`,
      );
    });

    return next();
  }
}
