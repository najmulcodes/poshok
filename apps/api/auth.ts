import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../services/token.service.js';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // Attach user payload to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (requiredRole: Role) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
  next();
};