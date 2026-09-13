import { Router } from "express";
import * as addressController from "../controllers/address.controller";
import { requireAuth } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addressValidator } from "../validators/address.validator";

const router = Router();

router.use(requireAuth());

router.get("/", addressController.getAddresses);
router.post("/", validate(addressValidator), addressController.createAddress);

router.get("/:id", addressController.getAddressById);

router.patch("/:id/default", addressController.setDefaultAddress);
router.put("/:id/default", addressController.setDefaultAddress); // Alias

router.patch("/:id", validate(addressValidator), addressController.updateAddress);
router.put("/:id", validate(addressValidator), addressController.updateAddress); // Alias

router.delete("/:id", addressController.deleteAddress);

export default router;
