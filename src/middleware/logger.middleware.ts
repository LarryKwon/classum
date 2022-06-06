import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // request.on('ended', () => {
    //   this.logger.log(
    //     `${method} ${originalUrl} has been executed from ${userAgent} ${ip}`,
    //   );
    // });

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} has been executed from ${userAgent} ${ip} response: ${statusCode} ${contentLength}`,
      );
    });
    next();
  }
}
