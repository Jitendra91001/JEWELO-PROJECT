import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// ✅ SIMPLE FIX (NO import.meta)
const __dirname = path.resolve();

// ROOT upload folder
const UPLOAD_ROOT = path.join(__dirname, "uploads");

// Ensure root folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

/* ---------------------------------------------------------
   🔥 STATIC FOLDER
----------------------------------------------------------- */
export const registerUploadFolder = (app: any) => {
  app.use("/uploads", express.static(UPLOAD_ROOT));
};

/* ---------------------------------------------------------
   🔥 MULTER
----------------------------------------------------------- */
const driverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = "other";

    if (file.fieldname === "image") subFolder = "category";

    const finalPath = path.join(UPLOAD_ROOT, subFolder);

    fs.mkdirSync(finalPath, { recursive: true });

    cb(null, finalPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${file.fieldname}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    cb(null, unique + ext);
  },
});

export const uploadDriver = multer({ storage: driverStorage });