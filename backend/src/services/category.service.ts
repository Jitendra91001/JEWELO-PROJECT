import prisma from '../database/db';
import { NotFoundError, ConflictError } from '../utils/errors';

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export const createCategory = async (data: CreateCategoryInput) => {
  // Check if category with this slug exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existingCategory) {
    throw new ConflictError('Category with this slug already exists');
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};

export const getAllCategories = async (onlyActive: boolean = true, search?: string) => {
  const where: any = onlyActive ? { isActive: true } : {};

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  return prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Check if new slug is unique
  if (data.slug && data.slug !== category.slug) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new ConflictError('Category with this slug already exists');
    }
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new ConflictError(
      'Cannot delete category with products. Delete products first.'
    );
  }

  return prisma.category.delete({ where: { id } });
};
