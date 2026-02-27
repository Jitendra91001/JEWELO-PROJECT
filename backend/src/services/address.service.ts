import prisma from '../database/db';
import { NotFoundError } from '../utils/errors';

export interface CreateAddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export const createAddress = async (
  userId: string,
  data: CreateAddressInput
) => {
  // If this is set as default, remove default from others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getUserAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
};

export const getAddressById = async (id: string, userId: string) => {
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address) {
    throw new NotFoundError('Address not found');
  }

  if (address.userId !== userId) {
    throw new Error('You do not have permission to access this address');
  }

  return address;
};

export const updateAddress = async (
  id: string,
  userId: string,
  data: UpdateAddressInput
) => {
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address) {
    throw new NotFoundError('Address not found');
  }

  if (address.userId !== userId) {
    throw new Error('You do not have permission to update this address');
  }

  // If setting as default, remove default from others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id },
    data,
  });
};

export const deleteAddress = async (id: string, userId: string) => {
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address) {
    throw new NotFoundError('Address not found');
  }

  if (address.userId !== userId) {
    throw new Error('You do not have permission to delete this address');
  }

  return prisma.address.delete({ where: { id } });
};

export const getDefaultAddress = async (userId: string) => {
  return prisma.address.findFirst({
    where: { userId, isDefault: true },
  });
};
