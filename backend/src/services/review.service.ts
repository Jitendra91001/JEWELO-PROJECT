import prisma from '../database/db';
import { NotFoundError, ConflictError } from '../utils/errors';

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export const createReview = async (
  userId: string,
  data: CreateReviewInput
) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check if user already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId: data.productId,
        userId,
      },
    },
  });

  if (existingReview) {
    throw new ConflictError('You have already reviewed this product');
  }

  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      productId: data.productId,
      userId,
      rating: Number(data.rating),
      title: data.title,
      comment: data.comment,
      images: data.images || [],
    },
    include: { user: { select: { id: true, name: true } } },
  });

  // Update product rating
  const reviews = await prisma.review.findMany({
    where: { productId: data.productId },
    select: { rating: true },
  });

  const averageRating = 
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: data.productId },
    data: {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    },
  });

  return review;
};

export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, total, page, limit };
};

export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      include: { product: { select: { id: true, name: true, thumbnail: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  return { reviews, total, page, limit };
};

export const updateReview = async (
  id: string,
  userId: string,
  data: UpdateReviewInput
) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  if (review.userId !== userId) {
    throw new Error('You can only edit your own reviews');
  }

  // Validate rating
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true } } },
  });

  // Recalculate product rating if rating was updated
  if (data.rating) {
    const reviews = await prisma.review.findMany({
      where: { productId: review.productId },
      select: { rating: true },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
      },
    });
  }

  return updatedReview;
};

export const deleteReview = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  if (review.userId !== userId) {
    throw new Error('You can only delete your own reviews');
  }

  await prisma.review.delete({ where: { id } });

  // Recalculate product rating
  const reviews = await prisma.review.findMany({
    where: { productId: review.productId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: 0, reviewCount: 0 },
    });
  } else {
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });
  }
};
