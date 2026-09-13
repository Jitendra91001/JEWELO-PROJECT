import { Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User, Role } from "../models";
import { AuthenticatedRequest } from "../types";
import { env } from "../config/env.config";
import { USER_ROLES } from "../constants";

const generateAuthToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ id: userId, email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE as any,
  });
};

export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
  if (existingUser) {
    throw ApiError.conflict("An account with this email address already exists");
  }

  // Find default USER role or create if not present
  let defaultRole = await Role.findOne({ code: USER_ROLES.CUSTOMER });
  if (!defaultRole) {
    defaultRole = await Role.create({
      code: USER_ROLES.CUSTOMER,
      name: "Customer",
      description: "Standard jewellery store customer",
      permissions: [],
      isSystem: true,
    });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone ? phone.trim() : undefined,
    role: defaultRole._id,
    isActive: true,
  });

  const token = generateAuthToken(user._id.toString(), user.email, USER_ROLES.CUSTOMER);

  // Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.created(res, "Registration successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: USER_ROLES.CUSTOMER,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  });
});

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false })
    .select("+password")
    .populate("role");

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account is suspended. Please contact customer support.");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const roleCode = (user.role as any)?.code || USER_ROLES.CUSTOMER;
  const token = generateAuthToken(user._id.toString(), user.email, roleCode);

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, "Login successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: roleCode,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  });
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const user = await User.findById(req.user.id).populate("role");
  if (!user || user.isDeleted) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.success(res, "Profile retrieved successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: (user.role as any)?.code || req.user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const { name, phone, email, avatarUrl } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || user.isDeleted) {
    throw ApiError.notFound("User not found");
  }

  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (avatarUrl) user.avatar = avatarUrl;
  if (req.file && (req.file as any).path) {
    user.avatar = (req.file as any).path;
  }

  if (email && email.toLowerCase().trim() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
    if (existing) {
      throw ApiError.conflict("Email is already taken by another account");
    }
    user.email = email.toLowerCase().trim();
    user.isEmailVerified = false;
  }

  await user.save();

  return ApiResponse.success(res, "Profile updated successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  });
});

export const forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });
    // In production, an email would be sent with resetToken.
  }

  return ApiResponse.success(
    res,
    "If an account with that email exists, password reset instructions have been dispatched."
  );
});

export const resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    isDeleted: false,
  });

  if (!user) {
    throw ApiError.badRequest("Password reset token is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return ApiResponse.success(res, "Password has been successfully updated. Please login.");
});
