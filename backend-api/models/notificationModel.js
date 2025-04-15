import { ObjectId } from "mongodb";
import database from "../config/database.js";

class NotificationModel {
  constructor() {
    this.collection = "notifications";
  }

  static Types = {
    INFO: "info",
    ALERT: "alert",
    WARNING: "warning",
    ANNOUNCEMENT: "announcement",
  };

  async createNotification(data) {
    const collection = database.getCollection(this.collection);

    const notification = {
      type: data.type,
      title: data.title,
      message: data.message,
      communityId: data.communityId,
      recipients: data.recipients ? data.recipients.map((id) => id) : [],
      read: [],
      createdAt: new Date(),
      updatedAt: new Date(),

      metadata: { ...data.metadata },
    };

    const result = await collection.insertOne(notification);
    return { ...notification, _id: result.insertedId };
  }

  async getUserNotifications(userId, communityId) {
    const collection = database.getCollection(this.collection);
    return await collection
      .find({
        $or: [
          { communityId: communityId, recipients: [] },
          { recipients: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async markAsRead(notificationId, userId) {
    const collection = database.getCollection(this.collection);
    return await collection.updateOne(
      { _id: ObjectId.createFromTime(notificationId) },
      {
        $addToSet: { read: ObjectId.createFromTime(userId) },
        $set: { updatedAt: new Date() },
      }
    );
  }
}

export default new NotificationModel();
