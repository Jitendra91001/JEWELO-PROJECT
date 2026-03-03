import prisma from '../database/db';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  hashToken,
} from '../utils/auth';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../schemas/auth.schema';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from './email.service';

export const register = async (data: RegisterInput) => {
  console.log(data , "data")
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  console.log(existingUser,"existingUser")

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data?.email,
      password: hashedPassword,
      name: data?.name,
      phone: data?.phone,
    },
  });

  const verificationToken = generateEmailVerificationToken();
  const hashedToken = hashToken(verificationToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken: hashedToken },
  });

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name || 'User');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name:user?.name,
      role: user.role,
    },
  };
};

export const login = async (data: LoginInput) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name:user?.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken();
  const hashedToken = hashToken(resetToken);

  // Save hashed token and expiry
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  });

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    console.error('Failed to send reset email:', error);
  }

  return { message: 'Password reset email sent' };
};

export const resetPassword = async (data: ResetPasswordInput) => {
  // Hash the provided token to compare
  const hashedToken = hashToken(data.token);
  // Find user with matching token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await hashPassword(data.password);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { message: 'Password reset successful' };
};

export const verifyEmail = async (token: string) => {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
    },
  });


  if (!user) {
    throw new AuthenticationError('Invalid verification token');
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
    },
  });

  return { message: 'Email verified successfully' };
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name:data?.name,
      email:data?.email,
      phone: data.phone,
      avatar: data.avatar,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name:user?.name,
    phone: user.phone,
    avatar: user.avatar,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name:true,
      phone: true,
      avatar: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
