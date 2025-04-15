import { ObjectId } from "mongodb";
import database from "../config/database.js";

class AdminModel {
  constructor() {
    this.collection = "admins";
  }

  async registerSuperAdmin(adminData) {
    const collection = database.getCollection(this.collection);
    const superAdmin = {
      fullName: adminData.fullName,
      email: adminData.email.toLowerCase(),
      password: adminData.password,
      role: "super_admin",
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(superAdmin);
    return { _id: result.insertedId };
  }

  async createAdmin(adminData) {
    const collection = database.getCollection(this.collection);

    const admin = {
      email: adminData.email.toLowerCase(),
      password: adminData.password,
      fullName: adminData.fullName,
      role: adminData.role || "admin",
      phoneNumber: adminData.phoneNumber,
      department: adminData.department || "general",
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(admin);
    return { ...admin, _id: result.insertedId };
  }

  async findByEmail(email) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({ email: email.toLowerCase() });
  }

  async findById(adminId) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({
      _id: ObjectId.createFromHexString(adminId),
    });
  }

  async findByUsername(username) {
    const collection = database.getCollection(this.collection);
    return await collection.findOne({ username });
  }

  async findByIdAndUpdate(adminId, updates) {
    const collection = database.getCollection(this.collection);

    const result = await collection.findOneAndUpdate(
      { _id: adminId },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async updateLastLogin(adminId) {
    const collection = database.getCollection(this.collection);

    const result = await collection.findOneAndUpdate(
      { _id: adminId },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async getAllAdmins() {
    const collection = database.getCollection(this.collection);
    return await collection.find({}).toArray();
  }

  async deactivateAdmin(adminId) {
    const collection = database.getCollection(this.collection);

    const result = await collection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(adminId) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result.value;
  }
}

export default new AdminModel();
