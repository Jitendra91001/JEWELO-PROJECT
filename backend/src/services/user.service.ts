import prisma from '../database/db';
import { NotFoundError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(role && { role: role as any }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    limit,
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      createdAt: true,
      addresses: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const updateUserRole = async (id: string, role: 'USER' | 'ADMIN') => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
};

export const toggleUserStatus = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return prisma.user.delete({ where: { id } });
};

export const getUserStats = async () => {
  const [totalUsers, activeUsers, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    adminCount,
  };
};
