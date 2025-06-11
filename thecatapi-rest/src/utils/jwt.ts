import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/EnvVariables';

// Generate JWT token with user data
export const generateToken = (userId: string, name: string, email: string): string => {
  const payload = {
    userId,
    name,
    email
  };
  
  return jwt.sign(
    payload,
    JWT_SECRET || 'fallback_secret_key',
    { expiresIn: JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET || 'fallback_secret_key');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Extract user data from token
export const extractUserFromToken = (token: string): { 
  userId: string;
  name: string;
  email: string;
} => {
  const decoded = verifyToken(token);
  return {
    userId: decoded.userId,
    name: decoded.name,
    email: decoded.email
  };
};
