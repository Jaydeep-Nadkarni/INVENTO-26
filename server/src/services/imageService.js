import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base directory for uploads
const UPLOAD_DIR = path.join(__dirname, "../../uploads/profiles");

/**
 * Processes the uploaded image:
 * 1. Resizes to 1000x1000 for high quality
 * 2. Converts to JPEG
 * 3. Compresses to 95% quality (Aiming for 200-300kb)
 * 4. Saves to filesystem
 * 
 * @param {Buffer} buffer - Raw image buffer from multer
 * @param {string} userId - User ID to be used as filename
 * @returns {Promise<string>} - Relative path to the saved image
 */
export const processProfilePhoto = async (buffer, userId) => {
  // Ensure directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const fileName = `${userId}.jpg`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await sharp(buffer)
    .resize(1000, 1000, {
      fit: "cover",
      position: "center"
    })
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(filePath);

  // Return the web-accessible path
  return `/uploads/profiles/${fileName}`;
};
