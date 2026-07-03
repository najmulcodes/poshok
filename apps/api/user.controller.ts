import { Request, Response } from 'express';
import prisma from '../../../lib/prisma.js';

export const getMe = async (req: Request, res: Response) => {
  // The user object is attached to the request by the `protect` middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
};