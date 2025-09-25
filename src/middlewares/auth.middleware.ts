import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtUser {
  id: string;
  role: 'admin' | 'doctor' | 'staff';
}


interface JwtPayload {
  email: string;
  role: string;
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('token', req.headers.authorization);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Runtime check to ensure it's not a string
    if (typeof decoded === 'string') {
      return res.status(403).json({ message: 'Invalid token payload' });
    }

    const user = decoded as JwtUser;

    // Optional: verify presence of required fields
    if (!user.id || !user.role) {
      return res.status(403).json({ message: 'Invalid token structure' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '7d',
  });
};
