import mongoose, { Document, Schema, Model } from "mongoose";

export interface IFeedback extends Document {
  name: string;
  rating: number;
  descriptionText: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    descriptionText: {
      type: String,
      required: [true, "Feedback description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default Feedback;
