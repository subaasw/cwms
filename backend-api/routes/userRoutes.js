import express from "express";
import { userController } from "../controllers/userController.js";
import pickupRequestController from "../controllers/pickupRequestController.js";
import reportsController from "../controllers/reportsController.js";
import notificationsController from "../controllers/notificationsController.js";

const router = express.Router();

router.get("/me", userController.getProfile);
router.put("/profile", userController.updateProfile);

router.post("/pickup-requests", pickupRequestController.createRequest);
router.get("/pickup-requests", pickupRequestController.getUserRequests);

router.post("/report-issues", reportsController.createReport);
router.get("/notifications", notificationsController.getUserNotifications);

export default router;
