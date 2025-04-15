import { ObjectId } from "mongodb";
import database from "../config/database.js";

class UserModel {
  constructor() {
    this.collection = "users";
  }

  async createUser(userData) {
    const collection = database.getCollection(this.collection);

    const user = {
      fullName: userData.fullName,
      community: userData.community,
      location: userData.location,
      email: userData.email.toLowerCase(),
      contactNumber: userData.contactNumber,
      password: userData.password,
      profilePicture: userData.profilePicture || null,
      address: userData.address || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findByEmail(email) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({ email: email.toLowerCase() });
  }

  async findByPhone(contactNumber) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({ contactNumber });
  }

  async findById(userId) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
  }

  async findByIdAndUpdate(userId, updates) {
    const collection = database.getCollection(this.collection);

    const result = await collection.findOneAndUpdate(
      { _id: userId },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return result;
  }
}

export default new UserModel();
