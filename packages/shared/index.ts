import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
  // iat, exp are automatically added by jsonwebtoken
}