import multer from "multer";

// Max size 5MB
const MAX_SIZE = 5 * 1024 * 1024;

// Accepted mime types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
  },
  fileFilter,
});

export default upload;
