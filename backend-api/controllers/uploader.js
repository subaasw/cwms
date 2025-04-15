import express from "express";
import { upload } from "../config/multer.js";

const router = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "File size too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  next();
};

router.post(
  "/upload",
  upload.single("image"),
  handleMulterError,
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      return res.status(200).json({
        status: "success",
        message: "File uploaded successfully",
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Server error during file upload",
        error: error.message,
      });
    }
  }
);

export default router;
