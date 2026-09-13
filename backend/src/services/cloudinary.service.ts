import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import multer from "multer";
import { env } from "../config/env.config";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: "jewellery/products",
  CATEGORIES: "jewellery/categories",
  COLLECTIONS: "jewellery/collections",
  BANNERS: "jewellery/banners",
  USERS: "jewellery/users",
  REVIEWS: "jewellery/reviews",
  CERTIFICATES: "jewellery/certificates",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

/**
 * Upload buffer to Cloudinary with automatic optimization
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: CloudinaryFolder | string,
  options: {
    publicId?: string;
    resourceType?: "image" | "raw" | "video";
    overwrite?: boolean;
    transformation?: Array<Record<string, any>>;
  } = {}
): Promise<CloudinaryUploadResult> => {
  const hasCredentials = Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );

  if (!hasCredentials) {
    logger.warn("Cloudinary credentials not configured; falling back to memory data URL.");
    const mimeType = options.resourceType === "raw" ? "application/pdf" : "image/jpeg";
    return {
      secure_url: `data:${mimeType};base64,${buffer.toString("base64")}`,
      public_id: `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      bytes: buffer.length,
    };
  }

  const generatedId = options.publicId || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: generatedId,
        resource_type: options.resourceType || "image",
        overwrite: options.overwrite !== undefined ? options.overwrite : true,
        transformation: options.transformation || [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error("Cloudinary upload stream failed:", error);
          reject(ApiError.internal("Failed to process asset upload through media gateway"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Delete asset from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
): Promise<boolean> => {
  if (!publicId || publicId.startsWith("fallback-")) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === "ok";
  } catch (error) {
    logger.error(`Failed to delete Cloudinary asset with public_id: ${publicId}`, error);
    return false;
  }
};

/**
 * Multer memory storage configuration with strict MIME type and file size validation
 */
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          400,
          `Invalid file format (${file.mimetype}). Only JPEG, PNG, WEBP, SVG, and PDF are supported.`
        ) as any,
        false
      );
    }
  },
});
