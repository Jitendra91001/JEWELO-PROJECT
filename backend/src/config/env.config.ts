import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.string().default("5000").transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BASE_URL: z.string().default("http://localhost:5000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL (MongoDB URI) is required"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters long").default("jewelo_super_secret_jwt_key_2026"),
  JWT_EXPIRE: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:8080"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE: z.string().default("5242880").transform(Number),
  SMTP_HOST: z.string().optional().default("sandbox.smtp.mailtrap.io"),
  SMTP_PORT: z.string().optional().default("2525").transform(Number),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().optional().default("concierge@jewelo.com"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export default env;
