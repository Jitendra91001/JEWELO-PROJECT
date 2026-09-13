import { Router } from "express";
import { authController } from "../controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  loginValidator,
  registerValidator,
  updateProfileValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";

const router = Router();

router.post("/login", validate(loginValidator), authController.login);
router.post("/register", validate(registerValidator), authController.register);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, validate(updateProfileValidator), authController.updateProfile);
router.post("/forgot-password", validate(forgotPasswordValidator), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordValidator), authController.resetPassword);

export default router;
