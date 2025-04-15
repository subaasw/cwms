import database from "../config/database.js";

export class ReportModel {
  constructor() {
    this.collection = "reports";
  }

  static IssueTypes = {
    MISSED_PICKUP: "missed_pickup",
    ILLEGAL_DUMPING: "illegal_dumping",
    SERVICE_COMPLAINT: "service_complaint",
    EQUIPMENT_DAMAGE: "equipment_damage",
    OTHER: "other",
  };

  static Status = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
    CLOSED: "closed",
  };

  async createReport(data) {
    const collection = database.getCollection(this.collection);

    const report = {
      userId: data.userId,
      communityId: data.communityId,
      issueType: data.issueType,
      description: data.description,
      address: data.address,
      photos: data.photos || [],
      status: ReportModel.Status.OPEN,
      assignedTo: null,
      resolution: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(report);
    return { ...report, _id: result.insertedId };
  }

  async getUserReports(userId, status = null) {
    try {
      const collection = database.getCollection(this.collection);
      const filter = { userId };

      if (status) {
        filter.status = status;
      }

      return await collection.find(filter).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Get User Reports Error:", error);
      throw error;
    }
  }

  async getCommunityReports(communityId, filters = {}) {
    try {
      const collection = database.getCollection(this.collection);
      const filter = { communityId };

      if (filters.status) {
        filter.status = filters.status;
      }

      if (filters.issueType) {
        filter.issueType = filters.issueType;
      }

      return await collection.find(filter).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Get Community Reports Error:", error);
      throw error;
    }
  }

  async updateStatus(reportId, status, adminId, resolution) {
    try {
      const collection = database.getCollection(this.collection);
      const updateData = {
        status,
        assignedTo: adminId,
        updatedAt: new Date(),
      };

      if (resolution) {
        updateData.resolution = resolution;
      }

      const result = await collection.findOneAndUpdate(
        { _id: reportId },
        { $set: updateData },
        { returnDocument: "after" }
      );

      return result.value;
    } catch (error) {
      console.error("Update Status Error:", error);
      throw error;
    }
  }

  async getAllReports(filters = {}) {
    try {
      const collection = database.getCollection(this.collection);
      const filter = {};

      if (filters.communityId) {
        filter.communityId = filters.communityId;
      }

      if (filters.status) {
        filter.status = filters.status;
      }

      if (filters.issueType) {
        filter.issueType = filters.issueType;
      }

      return await collection.find(filter).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Get All Reports Error:", error);
      throw error;
    }
  }

  async getReportById(reportId) {
    try {
      const collection = database.getCollection(this.collection);
      return await collection.findOne({
        _id: reportId,
      });
    } catch (error) {
      console.error("Get Report By Id Error:", error);
      throw error;
    }
  }

  async getReportStats(communityId) {
    try {
      const collection = database.getCollection(this.collection);
      const stats = await collection
        .aggregate([
          {
            $match: { communityId: communityId },
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              open: {
                $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
              },
              inProgress: {
                $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
              },
              resolved: {
                $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
              },
              closed: {
                $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
              },
            },
          },
        ])
        .toArray();

      return (
        stats[0] || {
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0,
        }
      );
    } catch (error) {
      console.error("Get Report Stats Error:", error);
      throw error;
    }
  }
}

export default new ReportModel();
