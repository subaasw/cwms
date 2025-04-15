import express from "express";
import { requireAdmin } from "../middleware/authenticate.js";
import { adminController } from "../controllers/authController.js";
import communityController from "../controllers/communityController.js";

const router = express.Router();

router.get("/me", adminController.getProfile);
router.put("/profile", adminController.updateProfile);

router.post("/communities", communityController.createCommunity);
router.put("/communities/:id/add-member", communityController.addMember);

export default router;
