const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];
  if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
    return cb(new Error('Unsupported file type. Allowed: png, jpg, jpeg, webp, pdf.'), false);
  }
  cb(null, true);
};

// Used as: upload.single('screenshot') on payment/withdrawal routes.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
