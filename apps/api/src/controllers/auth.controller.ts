import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateTokens, verifyRefreshToken, REFRESH_TOKEN_COOKIE_NAME } from '../services/token.service.js';
import { config } from '../config/config.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'strict' as const,
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const { accessToken } = generateTokens({ userId: payload.userId, role: payload.role });

    res.status(200).json({ accessToken });
  } catch (error) {
    // This will catch expired or invalid tokens from verifyRefreshToken
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};