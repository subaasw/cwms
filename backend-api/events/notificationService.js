import NotificationEvents, {
  notificationEvents,
} from "./notificationEvents.js";
import notificationModel from "../models/notificationModel.js";

class NotificationService {
  constructor() {
    this.initializeAdminEventListeners();
    this.initializeUserEventListeners();
  }

  initializeAdminEventListeners() {
    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.PICKUP.APPROVED,
      this.handleAdminPickupApproved.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.PICKUP.COMPLETED,
      this.handleAdminPickupCompleted.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.PICKUP.REJECTED,
      this.handleAdminPickupRejected.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.REPORT.STATUS_UPDATED,
      this.handleAdminReportStatusUpdated.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.REPORT.RESOLVED,
      this.handleAdminReportResolved.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.ADMIN_EVENTS.ANNOUNCEMENT.CREATED,
      this.handleAdminAnnouncement.bind(this)
    );
  }

  initializeUserEventListeners() {
    notificationEvents.on(
      NotificationEvents.USER_EVENTS.PICKUP.CREATED,
      this.handleUserPickupCreated.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.USER_EVENTS.PICKUP.CANCELLED,
      this.handleUserPickupCancelled.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.USER_EVENTS.REPORT.CREATED,
      this.handleUserReportCreated.bind(this)
    );

    notificationEvents.on(
      NotificationEvents.USER_EVENTS.REPORT.UPDATED,
      this.handleUserReportUpdated.bind(this)
    );
  }

  async handleAdminReportStatusUpdated(data) {
    await this.createNotification({
      type: "REPORT_STATUS_UPDATED",
      title: "Report Status Updated",
      message: `Your report status has been updated to ${data.status}`,
      recipients: [data.userId],
      communityId: data.communityId,
      metadata: {
        reportId: data.reportId,
        adminId: data.adminId,
        status: data.status,
        notes: data.notes,
      },
    });
  }

  async handleAdminReportResolved(data) {
    await this.createNotification({
      type: "REPORT_RESOLVED",
      title: "Report Resolved",
      message: `Your report has been resolved`,
      recipients: [data.userId],
      communityId: data.communityId,
      metadata: {
        reportId: data.reportId,
        adminId: data.adminId,
        resolution: data.resolution,
      },
    });
  }

  async handleAdminPickupApproved(data) {
    await this.createNotification({
      type: "PICKUP_APPROVED",
      title: "Pickup Request Approved",
      message: `Your pickup request for ${data.pickupDate} has been approved`,
      recipients: [data.userId],
      communityId: data.communityId,
      requestId: data.requestId,
      adminId: data.adminId,
    });
  }

  async handleAdminPickupCompleted(data) {
    await this.createNotification({
      type: "PICKUP_COMPLETED",
      title: "Pickup Completed",
      message: `Your pickup request has been completed`,
      recipients: [data.userId],
      communityId: data.communityId,
      metadata: {
        requestId: data.requestId,
        adminId: data.adminId,
        notes: data.notes,
      },
    });
  }

  async handleAdminPickupRejected(data) {
    await this.createNotification({
      type: "PICKUP_REJECTED",
      title: "Pickup Request Rejected",
      message: `Your request was rejected. Reason: ${data.reason}`,
      recipients: [data.userId],
      communityId: data.communityId,
      metadata: {
        requestId: data.requestId,
        adminId: data.adminId,
        reason: data.reason,
      },
    });
  }

  async handleAdminAnnouncement(data) {
    await this.createNotification({
      type: "ANNOUNCEMENT",
      title: data.title,
      message: data.message,
      recipients: [], // Empty array means all community members
      communityId: data.communityId,
      metadata: {
        adminId: data.adminId,
        priority: data.priority,
      },
    });
  }

  // User Event Handlers
  async handleUserPickupCreated(data) {
    await this.createNotification({
      type: "NEW_PICKUP_REQUEST",
      title: "New Pickup Request",
      message: `New pickup request for ${data.pickupDate}`,
      recipients: [], // Empty array means notify all admins
      communityId: data.communityId,
      metadata: {
        requestId: data.requestId,
        userId: data.userId,
        wasteType: data.wasteType,
      },
    });
  }

  async handleUserReportCreated(data) {
    await this.createNotification({
      type: "NEW_REPORT",
      title: "New Report Submitted",
      message: `New ${data.issueType} report submitted`,
      recipients: [], // Notify all admins
      communityId: data.communityId,
      metadata: {
        reportId: data.reportId,
        userId: data.userId,
        issueType: data.issueType,
        priority: data.priority || "normal",
      },
    });
  }

  async handleUserReportUpdated(data) {
    await this.createNotification({
      type: "REPORT_UPDATED",
      title: "Report Updated",
      message: `A report has been updated by the user`,
      recipients: [], // Notify all admins
      communityId: data.communityId,
      metadata: {
        reportId: data.reportId,
        userId: data.userId,
        updates: data.updates,
      },
    });
  }

  async createNotification(notificationData) {
    try {
      const notification = await notificationModel.createNotification({
        ...notificationData,
        createdAt: new Date(),
        read: [],
      });
      return notification;
    } catch (error) {
      console.error("Create Notification Error:", error);
      throw error;
    }
  }

  async handleUserPickupCancelled(data) {
    await this.createNotification({
      type: "PICKUP_CANCELLED",
      title: "Pickup Request Cancelled",
      message: `A pickup request has been cancelled by the user`,
      recipients: [], // Notify all admins
      communityId: data.communityId,
      metadata: {
        requestId: data.requestId,
        userId: data.userId,
      },
    });
  }

  async handleUserReportCreated(data) {
    await this.createNotification({
      type: "NEW_REPORT",
      title: "New Report Submitted",
      message: `New ${data.issueType} report submitted`,
      recipients: [], // Notify all admins
      communityId: data.communityId,
      metadata: {
        reportId: data.reportId,
        userId: data.userId,
        priority: data.priority,
      },
    });
  }

  // Helper method to create notification
  async createNotification(notificationData) {
    try {
      const notification = await notificationModel.createNotification({
        ...notificationData,
        createdAt: new Date(),
        read: [],
      });
      return notification;
    } catch (error) {
      console.error("Create Notification Error:", error);
    }
  }
}

export const notificationService = new NotificationService();
