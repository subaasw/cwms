import notificationModel from "../models/notificationModel.js";

export class NotificationsController {
  async getUserNotifications(req, res) {
    try {
      const userId = req.user._id;
      const communityId = req.user.community;

      const notifications = await notificationModel.getUserNotifications(
        userId,
        communityId
      );

      res.json(notifications);
    } catch (error) {
      console.error("Get User Notifications Error:", error);
      res.status(500).json({
        message: "Failed to fetch notifications",
      });
    }
  }

  async getAdminNotifications(req, res) {
    try {
      const communityId = req.admin.communityId;

      const notifications = await notificationModel.getCommunityNotifications(
        communityId
      );

      res.json(notifications);
    } catch (error) {
      console.error("Get Admin Notifications Error:", error);
      res.status(500).json({
        message: "Failed to fetch notifications",
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      const result = await notificationModel.markAsRead(notificationId, userId);

      if (!result) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message: "Notification marked as read",
      });
    } catch (error) {
      console.error("Mark As Read Error:", error);
      res.status(500).json({
        message: "Failed to mark notification as read",
      });
    }
  }

  async createAnnouncement(req, res) {
    try {
      const adminId = req.admin._id;
      const communityId = req.admin.communityId;
      const { title, message, priority = "normal" } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          message: "Title and message are required",
        });
      }

      notificationEvents.emit(
        NotificationEvents.ADMIN_EVENTS.ANNOUNCEMENT.CREATED,
        {
          title,
          message,
          communityId,
          adminId,
          priority,
        }
      );

      res.json({
        message: "Announcement created successfully",
      });
    } catch (error) {
      console.error("Create Announcement Error:", error);
      res.status(500).json({
        message: "Failed to create announcement",
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user._id;
      const communityId = req.user.communityId;

      const count = await notificationModel.getUnreadCount(userId, communityId);

      res.json({ count });
    } catch (error) {
      console.error("Get Unread Count Error:", error);
      res.status(500).json({
        message: "Failed to get unread count",
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user._id;
      const communityId = req.user.communityId;

      await notificationModel.markAllAsRead(userId, communityId);

      res.json({
        message: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Mark All As Read Error:", error);
      res.status(500).json({
        message: "Failed to mark notifications as read",
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const adminId = req.admin._id;
      const communityId = req.admin.communityId;

      const result = await notificationModel.deleteNotification(
        notificationId,
        adminId,
        communityId
      );

      if (!result) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message: "Notification deleted successfully",
      });
    } catch (error) {
      console.error("Delete Notification Error:", error);
      res.status(500).json({
        message: "Failed to delete notification",
      });
    }
  }
}

export default new NotificationsController();
