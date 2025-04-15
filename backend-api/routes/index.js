import express from "express";
import { authenticate, requireAdmin } from "../middleware/authenticate.js";
import uploadRoute from "../controllers/uploader.js";
import communityController from "../controllers/communityController.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", authenticate, userRoutes);
router.use("/admin", requireAdmin, adminRoutes);
router.use("/communities", communityController.getAllCommunities);
router.use("/image", uploadRoute);

export default router;
