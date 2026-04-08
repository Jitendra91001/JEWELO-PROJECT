import prisma from './db';
import { hashPassword } from '../utils/auth';

const seed = async () => {
  try {
    // Clear existing data
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    // Create categories
    console.log('Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Rings',
          slug: 'rings',
          description: 'Beautiful collection of rings',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Necklaces',
          slug: 'necklaces',
          description: 'Elegant necklaces for every occasion',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Bracelets',
          slug: 'bracelets',
          description: 'Stunning bracelets collection',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Earrings',
          slug: 'earrings',
          description: 'Stylish earrings for all styles',
        },
      }),
    ]);

    // Create products
    console.log('Creating products...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Diamond Ring',
          slug: 'diamond-ring',
          description: 'Stunning diamond ring with 18k gold',
          price: 599.99,
          discountPrice: 499.99,
          cost: 300,
          categoryId: categories[0].id,
          sku: 'RING-001',
          quantity: 50,
          material: 'Gold',
          weight: 5.5,
          isFeatured: true,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Gold Necklace',
          slug: 'gold-necklace',
          description: 'Elegant gold necklace',
          price: 349.99,
          cost: 180,
          categoryId: categories[1].id,
          sku: 'NECK-001',
          quantity: 30,
          material: 'Gold',
          weight: 3.2,
          isFeatured: true,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Pearl Bracelet',
          slug: 'pearl-bracelet',
          description: 'Classic pearl bracelet',
          price: 249.99,
          discountPrice: 199.99,
          cost: 120,
          categoryId: categories[2].id,
          sku: 'BRAC-001',
          quantity: 45,
          material: 'Pearl',
          weight: 2.8,
          isFeatured: true,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Diamond Earrings',
          slug: 'diamond-earrings',
          description: 'Sparkling diamond earrings',
          price: 449.99,
          cost: 250,
          categoryId: categories[3].id,
          sku: 'EAR-001',
          quantity: 25,
          material: 'Gold',
          weight: 4.2,
          isFeatured: false,
        },
      }),
    ]);

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await hashPassword('Admin@123');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@jewelry.com',
        password: adminPassword,
        name: 'Admin',
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true,
      },
    });

    // Create regular user
    console.log('Creating regular user...');
    const userPassword = await hashPassword('User@123');
    const user = await prisma.user.create({
      data: {
        email: 'user@jewelry.com',
        password: userPassword,
        name: 'John Doe',
        phone: '+1234567890',
        role: 'USER',
        isEmailVerified: true,
        isActive: true,
      },
    });

    // Create user address
    console.log('Creating user address...');
    await prisma.address.create({
      data: {
        userId: user.id,
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      },
    });

    // Create coupons
    console.log('Creating coupons...');
    await Promise.all([
      prisma.coupon.create({
        data: {
          code: 'WELCOME10',
          description: 'Welcome discount - 10% off',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minPurchase: 50,
          usageLimit: 100,
          validFrom: new Date(),
          validUpto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.coupon.create({
        data: {
          code: 'SAVE20',
          description: '$20 off on orders over $100',
          discountType: 'FIXED',
          discountValue: 20,
          minPurchase: 100,
          usageLimit: 50,
          validFrom: new Date(),
          validUpto: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    console.log('✓ Database seed completed successfully');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
