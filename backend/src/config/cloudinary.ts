import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image",
) => {
  const hasCloudinaryCreds = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );

  if (!hasCloudinaryCreds) {
    const mimeType = resourceType === "raw" ? "application/pdf" : "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return {
      secure_url: dataUrl,
      public_id: `${folder}-local-fallback`,
      resource_type: resourceType,
    };
  }

  const publicId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return new Promise<{ secure_url: string; public_id: string; resource_type: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
