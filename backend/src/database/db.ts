import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('✓ Database disconnected');
  } catch (error) {
    console.error('��� Error disconnecting database:', error);
  }
};

export default prisma;
