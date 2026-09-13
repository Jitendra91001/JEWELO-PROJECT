import { Router } from "express";
import { settingsController } from "../controllers";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants";

const router = Router();

router.get("/", settingsController.getSettings);
router.put(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  settingsController.updateSettings
);

export default router;
