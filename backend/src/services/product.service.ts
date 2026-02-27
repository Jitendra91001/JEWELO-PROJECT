import prisma from "../database/db";
import { ObjectId } from "mongodb";
import { NotFoundError, ConflictError } from "../utils/errors";
import {
  CreateProductInput,
  UpdateProductInput,
  FilterProductInput,
} from "../schemas/product.schema";
import { Prisma } from "@prisma/client";

export const createProduct = async (data: CreateProductInput) => {
  const existingSku = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existingSku) {
    throw new ConflictError("Product with this SKU already exists");
  }

  // Check if slug already exists
  const existingSlug = await prisma.product.findUnique({
    where: { slug: data.slug },
  });

  if (existingSlug) {
    throw new ConflictError("Product with this slug already exists");
  }

  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      cost: data.cost,
      categoryId: data.categoryId,
      sku: data.sku,
      quantity: data.quantity || 0,
      thumbnail: data.thumbnail,
      material: data.material,
      weight: data.weight,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true,} },
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

export const getProducts = async (filters: FilterProductInput) => {
  const {
    search = "",
    categoryId,
    minPrice,
    maxPrice,
    isFeatured,
    material,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = 'desc',
    createdAt
  } = filters;

  const skip = (page - 1) * limit;

  const validCategoryId =
    categoryId && ObjectId.isValid(categoryId) ? categoryId : undefined;
  //  const validCreatedAt = createdAt ? new Date(createdAt) : undefined;

   const validCreatedAt = createdAt 
  ? (() => {
      const date = new Date(createdAt);
      return isNaN(date.getTime()) ? undefined : date;
    })()
  : undefined;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(validCategoryId && { categoryId: validCategoryId }),
    ...(isFeatured !== undefined && { isFeatured }),
    ...(material && { material: { contains: material, mode: "insensitive" } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    // ...(validCreatedAt && { createdAt: { gte: validCreatedAt } }),
      ...(validCreatedAt && { 
      createdAt: { 
        gte: validCreatedAt // Use explicit operator
      } 
    }),
  };


  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sortBy === "price") {
    orderBy.price = sortOrder;
  } else if (sortBy === "rating") {
    orderBy.rating = sortOrder;
  } else if (sortBy === "name") {
    orderBy.name = sortOrder;
  } 
  else {
    orderBy.createdAt = sortOrder;
  } 

  console.log(where,"where")

  console.log('validCreatedAt:', validCreatedAt, typeof validCreatedAt);
console.log('where object:', JSON.stringify(where, (k, v) => 
  typeof v === 'object' && v !== null ? '[Date/Object]' : v
));

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    limit,
  };
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Check SKU uniqueness if being updated
  if (data.sku && data.sku !== product.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new ConflictError("Product with this SKU already exists");
    }
  }

  // Check slug uniqueness if being updated
  if (data.slug && data.slug !== product.slug) {
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new ConflictError("Product with this slug already exists");
    }
  }

  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return prisma.product.delete({ where: { id } });
};

export const getFeaturedProducts = async (limit: number = 8) => {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: { category: true },
    take: limit,
  });
};
