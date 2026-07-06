import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';
import { config } from '../config/config.js';

const safeEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const secret = authHeader?.split(' ')[1];

  if (secret && safeEqual(secret, config.internalCronSecret)) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};