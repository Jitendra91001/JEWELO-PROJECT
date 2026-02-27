import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'http://localhost:8080',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/jewelryBackend',

  // JWT
  jwtSecret: process.env.JWT_SECRET! as string,
  jwtExpire: process.env.JWT_EXPIRE! as string,

  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@jewelry.com',
  },

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
