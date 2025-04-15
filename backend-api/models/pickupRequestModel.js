import { ObjectId } from "mongodb";
import database from "../config/database.js";

class PickupRequestModel {
  constructor() {
    this.collection = "pickupRequests";
  }

  static WasteTypes = {
    HOUSEHOLD: "household",
    RECYCLABLE: "recyclable",
    HAZARDOUS: "hazardous",
  };

  static Status = {
    PENDING: "pending",
    APPROVED: "approved",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  async createRequest(data) {
    const collection = database.getCollection(this.collection);

    const request = {
      userId: data.userId,
      communityId: data.communityId,
      pickupDate: new Date(data.pickupDate),
      pickupTime: data.pickupTime,
      wasteType: data.wasteType,
      notes: data.notes || "",
      status: PickupRequestModel.Status.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(request);
    return { ...request, _id: result.insertedId };
  }

  async getUserRequests(userId) {
    const collection = database.getCollection(this.collection);
    return await collection
      .find({
        userId: ObjectId.createFromTime(userId),
      })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getCommunityRequests(communityId) {
    const collection = database.getCollection(this.collection);
    return await collection
      .find({
        communityId: ObjectId.createFromTime(communityId),
      })
      .sort({ createdAt: -1 })
      .toArray();
  }
}

export default new PickupRequestModel();
