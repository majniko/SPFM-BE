import { JwtPayload } from '@identity/auth/types/jwt-payload';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
