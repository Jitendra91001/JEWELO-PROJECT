import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User, Role } from "../models";
import { AuthenticatedRequest } from "../types";
import { parsePaginationParams } from "../utils/pagination";
import { logAudit } from "../services/audit.service";
import { USER_ROLES } from "../constants";

export const getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, skip } = parsePaginationParams(req);
  const { search, role, status, startDate, endDate, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const filter: any = { isDeleted: false };

  // Text search on name, email, phone
  if (search) {
    const searchRegex = new RegExp(String(search), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
  }

  // Filter by status
  if (status !== undefined && status !== "ALL") {
    filter.isActive = status === "active" || status === "true";
  }

  // Filter by role
  if (role) {
    const roleDoc = await Role.findOne({
      $or: [{ code: String(role).toUpperCase() }, { name: new RegExp(String(role), "i") }],
    });
    if (roleDoc) {
      filter.role = roleDoc._id;
    }
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(String(startDate));
    if (endDate) filter.createdAt.$lte = new Date(String(endDate));
  }

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortObj: any = { [String(sortBy)]: sortDirection };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("role", "name code"),
    User.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, "Users retrieved successfully", users, page, limit, total);
});

export const getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id, isDeleted: false })
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .populate({
      path: "role",
      populate: { path: "permissions", model: "Permission" },
    });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.success(res, "User details retrieved successfully", user);
});

export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, phone, roleCode } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
  if (existingUser) {
    throw ApiError.conflict("An account with this email address already exists");
  }

  // Verify requested role
  const targetRoleCode = (roleCode || USER_ROLES.STAFF).toUpperCase();

  // Prevent assigning SUPER_ADMIN unless actor is SUPER_ADMIN
  if (targetRoleCode === USER_ROLES.SUPER_ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("Only a Super Administrator can create another Super Administrator");
  }

  let roleDoc = await Role.findOne({ code: targetRoleCode });
  if (!roleDoc) {
    roleDoc = await Role.create({
      code: targetRoleCode,
      name: targetRoleCode,
      permissions: [],
      isSystem: false,
    });
  }

  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone ? phone.trim() : undefined,
    role: roleDoc._id,
    isActive: true,
  });

  await logAudit(req, {
    action: "USER_CREATE",
    module: "USERS",
    entityId: newUser._id.toString(),
    entityType: "User",
    changes: { after: { email: newUser.email, role: targetRoleCode } },
  });

  const responseUser = await User.findById(newUser._id)
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .populate("role", "name code");

  return ApiResponse.created(res, "User created successfully", responseUser);
});

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, phone, email, avatar } = req.body;

  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const beforeSnapshot = { name: user.name, phone: user.phone, email: user.email };

  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (avatar) user.avatar = avatar;

  if (email && email.toLowerCase().trim() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id }, isDeleted: false });
    if (existing) {
      throw ApiError.conflict("Email is already taken by another account");
    }
    user.email = email.toLowerCase().trim();
  }

  await user.save();

  await logAudit(req, {
    action: "USER_UPDATE",
    module: "USERS",
    entityId: user._id.toString(),
    entityType: "User",
    changes: { before: beforeSnapshot, after: { name: user.name, phone: user.phone, email: user.email } },
  });

  const updatedUser = await User.findById(id)
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .populate("role", "name code");

  return ApiResponse.success(res, "User updated successfully", updatedUser);
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.id === id) {
    throw ApiError.badRequest("You cannot delete your own account");
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if ((user.role as any)?.code === USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("SUPER_ADMIN accounts cannot be deleted");
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  await logAudit(req, {
    action: "USER_DELETE",
    module: "USERS",
    entityId: id,
    entityType: "User",
  });

  return ApiResponse.success(res, "User deleted successfully");
});

export const updateUserStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (req.user?.id === id) {
    throw ApiError.badRequest("You cannot modify your own active status");
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if ((user.role as any)?.code === USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("SUPER_ADMIN accounts cannot be deactivated");
  }

  user.isActive = isActive !== undefined ? Boolean(isActive) : !user.isActive;
  await user.save();

  await logAudit(req, {
    action: "USER_STATUS_TOGGLE",
    module: "USERS",
    entityId: id,
    entityType: "User",
    changes: { after: { isActive: user.isActive } },
  });

  return ApiResponse.success(res, "User status updated successfully", {
    id: user._id,
    name: user.name,
    isActive: user.isActive,
  });
});

export const updateUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw ApiError.badRequest("Role identifier or code is required");
  }

  if (req.user?.id === id && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("You cannot modify your own role (privilege escalation prevented)");
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const currentTargetRoleCode = (user.role as any)?.code || user.role;
  if (currentTargetRoleCode === USER_ROLES.SUPER_ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("Only a SUPER_ADMIN can modify another SUPER_ADMIN role");
  }

  let targetRoleDoc = await Role.findOne({
    $or: [{ code: String(role).toUpperCase() }, { _id: role }],
  });

  if (!targetRoleDoc) {
    targetRoleDoc = await Role.create({
      code: String(role).toUpperCase(),
      name: role,
      permissions: [],
      isSystem: false,
    });
  }

  if (targetRoleDoc.code === USER_ROLES.SUPER_ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("You do not have permission to grant the SUPER_ADMIN role");
  }

  user.role = targetRoleDoc._id as any;
  await user.save();

  await logAudit(req, {
    action: "USER_ROLE_CHANGE",
    module: "USERS",
    entityId: id,
    entityType: "User",
    changes: {
      before: { role: currentTargetRoleCode },
      after: { role: targetRoleDoc.code },
    },
  });

  const updatedUser = await User.findById(id)
    .select("-password")
    .populate("role", "name code");

  return ApiResponse.success(res, "User role updated successfully", updatedUser);
});

export const blockUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (req.user?.id === id) {
    throw ApiError.badRequest("You cannot block yourself");
  }

  const user = await User.findOne({ _id: id, isDeleted: false }).populate("role");
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if ((user.role as any)?.code === USER_ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden("SUPER_ADMIN accounts cannot be blocked");
  }

  user.isActive = false;
  await user.save();

  await logAudit(req, {
    action: "USER_BLOCKED",
    module: "USERS",
    entityId: id,
    entityType: "User",
    changes: { after: { reason: reason || "Administrative block", isActive: false } },
  });

  return ApiResponse.success(res, "User blocked successfully", {
    id: user._id,
    name: user.name,
    isActive: false,
    reason,
  });
});
