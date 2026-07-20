import multer from "multer";
import express from "express";
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export const registerUploadFolder = (app: any) => {
  app.use("/uploads", express.static(UPLOAD_ROOT));
};

export const uploadDriver = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});