import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image file to upload.',
    });
  }

  // Generate public URL path
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    url: fileUrl,
  });
});

export default router;

