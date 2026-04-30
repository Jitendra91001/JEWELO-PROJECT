import prisma from "../database/db";

export const createFeedbackService = async (data: {
  name: string;
  rating: number;
  descriptionText: string;
}) => {
  return prisma.feedback.create({
    data,
  });
};

export const getFeedbacksService = async () => {
  return prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const deleteFeedbackService = async (id: string) => {
  return prisma.feedback.delete({
    where: { id },
  });
};
