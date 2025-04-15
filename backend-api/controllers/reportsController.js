import { notificationService } from "../events/notificationService.js";
import reportModel, { ReportModel } from "../models/reportModel.js";
import { saveBase64Image } from "./base64ImageUploader.js";

export class ReportController {
  async createReport(req, res) {
    try {
      const userId = req.user._id;
      const communityId = req.user.community;
      const { issueType, description, latitude, longitude, address, photos } =
        req.body;

      if (!issueType || !description || !address) {
        return res.status(400).json({
          message: "Issue type, description and address are required",
        });
      }

      const imagesURLs = [];
      if (Array.isArray(photos) && photos.length > 0) {
        photos.forEach(async (photo) => {
          const converted = await saveBase64Image(photo);
          if (converted.success) {
            imagesURLs.push(converted.url);
          }
        });
      }

      if (!Object.values(ReportModel.IssueTypes).includes(issueType)) {
        return res.status(400).json({
          message: "Invalid issue type",
          validTypes: ReportModel.IssueTypes,
        });
      }

      const report = await reportModel.createReport({
        userId,
        communityId,
        issueType,
        description,
        address,
        photos: imagesURLs,
      });

      await notificationService.handleUserReportCreated({
        reportId: report._id,
        issueType,
        communityId,
        userId,
      });

      res.status(201).json({
        message: "Report created successfully",
        report,
      });
    } catch (error) {
      console.error("Create Report Error:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  }

  async getUserReports(req, res) {
    try {
      const userId = req.user._id;
      const { status, page = 1, limit = 10 } = req.query;

      const filter = { userId };
      if (status) {
        filter.status = status;
      }

      const reports = await reportModel.getUserReports(filter, {
        page: Number(page),
        limit: Number(limit),
      });

      res.json(reports);
    } catch (error) {
      console.error("Get User Reports Error:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  }

  async getAllReports(req, res) {
    const communityId = req.user.community;

    try {
      const {
        status,
        issueType,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;

      const filter = {};

      if (communityId) {
        filter.communityId = communityId;
      }
      if (status) {
        filter.status = status;
      }
      if (issueType) {
        filter.issueType = issueType;
      }

      const reports = await reportModel.getAllReports(filter);

      res.json(reports);
    } catch (error) {
      console.error("Get All Reports Error:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  }

  async updateReportStatus(req, res) {
    try {
      const adminId = req.admin._id;
      const { reportId } = req.params;
      const { status, resolution } = req.body;

      // Validate status
      if (!Object.values(ReportModel.Status).includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
          validStatuses: ReportModel.Status,
        });
      }

      // If marking as resolved or closed, resolution is required
      if (["resolved", "closed"].includes(status) && !resolution) {
        return res.status(400).json({
          message:
            "Resolution is required when marking report as resolved or closed",
        });
      }

      const updatedReport = await this.reportModel.updateStatus(
        reportId,
        status,
        adminId,
        resolution
      );

      if (!updatedReport.modifiedCount) {
        return res.status(404).json({ message: "Report not found" });
      }

      await notificationService.handleAdminReportStatusUpdated({
        reportId,
        status,
        resolution,
        userId: updatedReport.userId,
        communityId: updatedReport.communityId,
        adminId,
      });

      res.json({
        message: "Report status updated successfully",
        report: updatedReport,
      });
    } catch (error) {
      console.error("Update Report Status Error:", error);
      res.status(500).json({ message: "Failed to update report status" });
    }
  }

  async assignReport(req, res) {
    try {
      const adminId = req.admin._id;
      const { reportId } = req.params;

      const updatedReport = await this.reportModel.updateStatus(
        reportId,
        ReportModel.Status.IN_PROGRESS,
        adminId
      );

      if (!updatedReport.modifiedCount) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json({
        message: "Report assigned successfully",
        report: updatedReport,
      });
    } catch (error) {
      console.error("Assign Report Error:", error);
      res.status(500).json({ message: "Failed to assign report" });
    }
  }
}

export default new ReportController();
