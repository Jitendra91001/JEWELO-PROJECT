import bcrypt from 'bcryptjs';
import jwt,{ SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import {JwtPayload} from '../types'
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpire as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
