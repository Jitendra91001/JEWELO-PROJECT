import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../types";

import {
  createFeedbackService,
  getFeedbacksService,
  deleteFeedbackService,
} from "../services/feedback.service";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getFeedbacksService();
    sendSuccess(res, data, "Feedback fetched successfully");
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, rating, descriptionText } = req.body;

    if (!name || !rating || !descriptionText) {
      throw new Error("All fields are required");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const data = await createFeedbackService({
      name,
      rating,
      descriptionText,
    });

    sendSuccess(res, data, "Feedback created successfully");
  } catch (error) {
    next(error);
  }
});

router.use(authenticate);
router.use(authorize("ADMIN"));

router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    await deleteFeedbackService(id);

    sendSuccess(res, null, "Feedback deleted successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
