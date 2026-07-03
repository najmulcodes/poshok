import { Request, Response, NextFunction } from 'express';
import { config } from '../../../config.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: config.isProduction ? '🥞' : err.stack,
  });
};