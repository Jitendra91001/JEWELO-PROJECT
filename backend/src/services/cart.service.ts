import prisma from '../database/db';
import { NotFoundError } from '../utils/errors';

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  let cartItem;

  if (existingItem) {
    // Update quantity
    cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: { product: true },
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: { product: true },
    });
  }

  return cartItem;
};

export const getCart = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { addedAt: 'desc' },
  });

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  return {
    items: cartItems,
    subtotal,
    itemCount: cartItems.length,
  };
};

export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeFromCart(userId, productId);
  }

  const cartItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: { quantity },
    include: { product: true },
  });

  return cartItem;
};

export const removeFromCart = async (userId: string, productId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!cartItem) {
    throw new NotFoundError('Cart item not found');
  }

  return prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const clearCart = async (userId: string) => {
  return prisma.cartItem.deleteMany({
    where: { userId },
  });
};
