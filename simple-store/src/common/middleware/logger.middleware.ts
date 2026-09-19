import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  const logger = new Logger('HTTP');

  res.on('finish', () => {
    const { statusCode } = res;
    logger.log(`${method} ${originalUrl} ${statusCode}`);
  });

  next();
}
