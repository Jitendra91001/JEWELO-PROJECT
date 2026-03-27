import prisma from "../database/db";

export const getDropdownData = async (types: string[]) => {
  const result: any = {};

  if (types.includes('categories')) {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    result.categories = categories;
  }

  if (types.includes('products')) {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    result.products = products;
  }

  if (types.includes('users')) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    result.users = users;
  }

  return result;
};