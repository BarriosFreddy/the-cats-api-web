import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config/EnvVariables';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const tokenHeader = req.headers.authorization;
  const tokenCookie = req.cookies?.token;
  
  const token = tokenHeader?.startsWith('Bearer ') ? tokenHeader.split(' ')[1] : tokenCookie;
  
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'fallback_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
