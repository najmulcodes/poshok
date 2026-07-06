import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // In production, only 4xx messages (expected, client-facing errors set
  // deliberately by a controller) are safe to return verbatim. A 500 here
  // means something unexpected broke, and its message may contain internal
  // details (query fragments, file paths, etc.) that shouldn't leak.
  const safeMessage =
    !config.isProduction || statusCode < 500 ? err.message : 'Something went wrong. Please try again.';

  res.status(statusCode).json({
    message: safeMessage,
    stack: config.isProduction ? undefined : err.stack,
  });
};