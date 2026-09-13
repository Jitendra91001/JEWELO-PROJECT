import { Router } from "express";
import * as userController from "../controllers/user.controller";
import {
  requireAuth,
  requirePermission,
  preventSelfRoleModification,
  preventSuperAdminDelete,
} from "../middlewares/rbac.middleware";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission(PERMISSIONS.USER_VIEW), userController.getUsers);
router.get("/:id", requirePermission(PERMISSIONS.USER_VIEW), userController.getUserById);
router.post("/", requirePermission(PERMISSIONS.USER_CREATE), userController.createUser);
router.patch("/:id", requirePermission(PERMISSIONS.USER_UPDATE), userController.updateUser);
router.delete(
  "/:id",
  requirePermission(PERMISSIONS.USER_DELETE),
  preventSuperAdminDelete,
  userController.deleteUser
);

// Targeted Sub-Resource Operations
router.patch(
  "/:id/status",
  requirePermission(PERMISSIONS.USER_UPDATE),
  preventSuperAdminDelete,
  userController.updateUserStatus
);

router.patch(
  "/:id/role",
  requirePermission(PERMISSIONS.ROLE_UPDATE),
  preventSelfRoleModification,
  userController.updateUserRole
);

router.patch(
  "/:id/block",
  requirePermission(PERMISSIONS.CUSTOMER_BLOCK),
  preventSuperAdminDelete,
  userController.blockUser
);

export default router;
