import { ObjectId } from "mongodb";
import database from "../config/database.js";

class CommunityModel {
  constructor() {
    this.collection = "communities";
  }

  async createCommunity(data) {
    const collection = database.getCollection(this.collection);

    const community = {
      name: data.name,
      description: data.description,
      address: data.address,
      location: data.location || null,
      pickupDays: data.pickupDays,
      pickupTimes: data.pickupTimes,
      createdBy: data.adminId,
      members: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(community);
    return result;
  }

  async findById(id) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({
      _id: ObjectId.createFromTime(id),
    });
  }

  async getAllCommunities() {
    const collection = database.getCollection(this.collection);
    return await collection.find({ active: true }).toArray();
  }

  async updateCommunity(communityId, updateData) {
    const collection = database.getCollection(this.collection);
    return await collection.findOneAndUpdate(
      { _id: communityId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }

  async addMember(communityId, userId) {
    const collection = database.getCollection(this.collection);
    return await collection.findOneAndUpdate(
      { _id: communityId },
      {
        $addToSet: { members: userId },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
  }

  async removeMember(communityId, userId) {
    const collection = database.getCollection(this.collection);
    return await collection.findOneAndUpdate(
      { _id: communityId },
      {
        $pull: { members: serId },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
  }

  async getMembers(communityId) {
    const collection = database.getCollection(this.collection);
    const community = await collection.findOne({
      _id: communityId,
    });
    return community ? community.members : [];
  }

  async deactivateCommunity(communityId) {
    const collection = database.getCollection(this.collection);
    return await collection.findOneAndUpdate(
      { _id: communityId },
      {
        $set: {
          active: false,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }
}

export default new CommunityModel();
