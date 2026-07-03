import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const secret = authHeader?.split(' ')[1];

  if (secret === config.internalCronSecret) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};