import express from "express";
import {
  adminController,
  authController,
} from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/user/register", authController.register);
router.post("/user/login", authController.login);
router.delete("/user/logout", authenticate, authController.logout);

router.post("/admin/login", adminController.login);
router.post("/admin/register", requireAdmin, adminController.register);
router.delete("/admin/logout", requireAdmin, authController.logout);

export default router;
