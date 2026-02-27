import prisma from '../database/db';
import { NotFoundError, ConflictError } from '../utils/errors';

export const addToWishlist = async (userId: string, productId: string) => {
  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check if already in wishlist
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    throw new ConflictError('Product already in wishlist');
  }

  return prisma.wishlistItem.create({
    data: {
      userId,
      productId,
    },
    include: { product: true },
  });
};

export const getWishlist = async (userId: string) => {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { addedAt: 'desc' },
  });
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!item) {
    throw new NotFoundError('Wishlist item not found');
  }

  return prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const isInWishlist = async (userId: string, productId: string) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return !!item;
};
