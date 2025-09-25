import { JwtUser } from '../../src/middlewares/auth.middleware'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}