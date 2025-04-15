import { notificationService } from "../events/notificationService.js";
import PickupRequestModel from "../models/pickupRequestModel.js";

export class PickupController {
  async createRequest(req, res) {
    try {
      const userId = req.user._id;
      const communityId = req.user.community;
      const { pickupDate, pickupTime, wasteType, notes } = req.body;

      if (!pickupDate || !pickupTime || !wasteType) {
        return res.status(400).json({
          message: "Pickup date, time and waste type are required",
        });
      }

      const request = await PickupRequestModel.createRequest({
        userId,
        communityId,
        pickupDate,
        pickupTime,
        wasteType,
        notes: notes || "",
        status: "pending",
      });

      notificationService.handleUserPickupCreated({
        requestId: request._id,
        pickupDate,
        wasteType,
        communityId,
        userId,
      });

      res.status(201).json({
        message: "Pickup request created successfully",
        request,
      });
    } catch (error) {
      console.error("Create Request Error:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  }

  async getUserRequests(req, res) {
    try {
      const userId = req.user._id;
      const { status, page = 1, limit = 10 } = req.query;

      const filter = { userId };
      if (status) filter.status = status;

      const requests = await PickupRequestModel.getUserRequests(filter, {
        page: Number(page),
        limit: Number(limit),
      });

      res.json(requests);
    } catch (error) {
      console.error("Get User Requests Error:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  }

  async cancelUserRequest(req, res) {
    try {
      const userId = req.user._id;
      const { requestId } = req.params;

      const request = await PickupRequestModel.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Only pending requests can be cancelled",
        });
      }

      const updatedRequest = await PickupRequestModel.updateStatus(
        requestId,
        "cancelled"
      );

      notificationService.handleUserPickupCancelled({
        requestId,
        communityId: request.communityId,
        userId,
      });

      res.json({
        message: "Request cancelled successfully",
        request: updatedRequest,
      });
    } catch (error) {
      console.error("Cancel Request Error:", error);
      res.status(500).json({ message: "Failed to cancel request" });
    }
  }

  // Admin Methods
  async getAllRequests(req, res) {
    try {
      const {
        communityId,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;

      const filter = {};

      if (communityId) filter.communityId = communityId;
      if (status) filter.status = status;
      if (startDate && endDate) {
        filter.pickupDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const requests = await PickupRequestModel.getRequests(filter, {
        page: Number(page),
        limit: Number(limit),
      });

      res.json(requests);
    } catch (error) {
      console.error("Get All Requests Error:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  }

  async approveRequest(req, res) {
    try {
      const adminId = req.admin._id;
      const { requestId } = req.params;

      const request = await PickupRequestModel.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Only pending requests can be approved",
        });
      }

      const updatedRequest = await PickupRequestModel.updateStatus(
        requestId,
        "approved",
        adminId
      );

      notificationService.handleAdminPickupApproved({
        requestId,
        status: "approved",
        userId: request.userId,
        communityId: request.communityId,
      });

      res.json({
        message: "Request approved successfully",
        request: updatedRequest,
      });
    } catch (error) {
      console.error("Approve Request Error:", error);
      res.status(500).json({ message: "Failed to approve request" });
    }
  }

  async completeRequest(req, res) {
    try {
      const adminId = req.admin._id;
      const { requestId } = req.params;
      const { notes } = req.body;

      const request = await PickupRequestModel.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "approved") {
        return res.status(400).json({
          message: "Only approved requests can be completed",
        });
      }

      const updatedRequest = await PickupRequestModel.updateStatus(
        requestId,
        "completed",
        adminId,
        notes
      );

      notificationService.handleAdminPickupCompleted({
        requestId,
        status: "completed",
        userId: request.userId,
        communityId: request.communityId,
      });

      res.json({
        message: "Request completed successfully",
        request: updatedRequest,
      });
    } catch (error) {
      console.error("Complete Request Error:", error);
      res.status(500).json({ message: "Failed to complete request" });
    }
  }

  async rejectRequest(req, res) {
    try {
      const adminId = req.admin._id;
      const { requestId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          message: "Rejection reason is required",
        });
      }

      const request = await PickupRequestModel.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Only pending requests can be rejected",
        });
      }

      const updatedRequest = await PickupRequestModel.updateStatus(
        requestId,
        "rejected",
        adminId,
        reason
      );

      notificationService.handleAdminPickupRejected({
        requestId,
        status: "rejected",
        userId: request.userId,
        communityId: request.communityId,
        reason,
      });

      res.json({
        message: "Request rejected",
        request: updatedRequest,
      });
    } catch (error) {
      console.error("Reject Request Error:", error);
      res.status(500).json({ message: "Failed to reject request" });
    }
  }

  async getRequestStats(req, res) {
    try {
      const { communityId, startDate, endDate } = req.query;

      const filter = {};

      if (communityId) filter.communityId = communityId;
      if (startDate && endDate) {
        filter.pickupDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const stats = await PickupRequestModel.getStats(filter);

      res.json({ stats });
    } catch (error) {
      console.error("Get Stats Error:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  }
}

export default new PickupController();
