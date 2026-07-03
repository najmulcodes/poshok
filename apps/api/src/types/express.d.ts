import { JwtPayload } from 'shared';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}