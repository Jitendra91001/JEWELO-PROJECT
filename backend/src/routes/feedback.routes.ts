import { Router } from "express";
import { feedbackController } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { createFeedbackValidator } from "../validators/review.validator";

const router = Router();

router.get("/", feedbackController.getFeedbacks);
router.post("/", validate(createFeedbackValidator), feedbackController.createFeedback);
router.delete("/:id", feedbackController.deleteFeedback);

export default router;
