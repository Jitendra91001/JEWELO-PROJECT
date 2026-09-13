import { Router } from "express";
import * as collectionController from "../controllers/collection.controller";
import { requireAuth, requirePermission } from "../middlewares/rbac.middleware";
import { uploadMiddleware } from "../services/cloudinary.service";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

const collectionUpload = uploadMiddleware.fields([
  { name: "banner", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// Public Collection Endpoints
router.get("/", collectionController.getCollections);
router.get("/:id", collectionController.getCollectionById);

// Admin Collection Management
router.post(
  "/",
  requireAuth(),
  requirePermission(PERMISSIONS.COLLECTION_CREATE),
  collectionUpload,
  collectionController.createCollection
);

router.patch(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COLLECTION_UPDATE),
  collectionUpload,
  collectionController.updateCollection
);

router.put(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COLLECTION_UPDATE),
  collectionUpload,
  collectionController.updateCollection
);

router.delete(
  "/:id",
  requireAuth(),
  requirePermission(PERMISSIONS.COLLECTION_DELETE),
  collectionController.deleteCollection
);

export default router;
