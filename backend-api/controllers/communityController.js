import NotificationEvents, {
  notificationEvents,
} from "../events/notificationEvents.js";
import communityModel from "../models/communityModel.js";

export class CommunityController {
  async createCommunity(req, res) {
    try {
      const adminId = req.admin._id;
      const { name, description, address, location, pickupDays, pickupTimes } =
        req.body;

      if (!name || !description || !address) {
        return res.status(400).json({
          message: "Name, description and address are required",
        });
      }

      const community = await communityModel.createCommunity({
        name,
        description,
        address,
        location,
        pickupDays,
        pickupTimes,
        adminId,
      });

      notificationEvents.emit(
        NotificationEvents.ADMIN_EVENTS.COMMUNITY.CREATED,
        {
          communityId: community._id,
          name: community.name,
          adminId,
        }
      );

      res.status(201).json({
        message: "Community created successfully",
        community,
      });
    } catch (error) {
      console.error("Create Community Error:", error);
      res.status(500).json({ message: "Failed to create community" });
    }
  }

  async getAllCommunities(req, res) {
    try {
      const communities = await communityModel.getAllCommunities();
      res.json(communities);
    } catch (error) {
      console.error("Get Communities Error:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  }

  async getCommunity(req, res) {
    try {
      const { communityId } = req.params;
      const community = await communityModel.findById(communityId);

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.json(community);
    } catch (error) {
      console.error("Get Community Error:", error);
      res.status(500).json({ message: "Failed to fetch community" });
    }
  }

  async updateCommunity(req, res) {
    try {
      const { communityId } = req.params;
      const updateData = req.body;

      const updatedCommunity = await communityModel.updateCommunity(
        communityId,
        updateData
      );

      if (!updatedCommunity.value) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.json({
        message: "Community updated successfully",
        community: updatedCommunity.value,
      });
    } catch (error) {
      console.error("Update Community Error:", error);
      res.status(500).json({ message: "Failed to update community" });
    }
  }

  async addMember(req, res) {
    try {
      const { communityId } = req.params;
      const { userId } = req.body;

      const result = await communityModel.addMember(communityId, userId);

      if (!result.value) {
        return res.status(404).json({ message: "Community not found" });
      }

      notificationEvents.emit(
        NotificationEvents.ADMIN_EVENTS.COMMUNITY.MEMBER_ADDED,
        {
          communityId,
          userId,
          adminId: req.admin._id,
        }
      );

      res.json({
        message: "Member added successfully",
        community: result.value,
      });
    } catch (error) {
      console.error("Add Member Error:", error);
      res.status(500).json({ message: "Failed to add member" });
    }
  }

  async removeMember(req, res) {
    try {
      const { communityId, userId } = req.params;

      const result = await communityModel.removeMember(communityId, userId);

      if (!result.value) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.json({
        message: "Member removed successfully",
        community: result.value,
      });
    } catch (error) {
      console.error("Remove Member Error:", error);
      res.status(500).json({ message: "Failed to remove member" });
    }
  }

  async deactivateCommunity(req, res) {
    try {
      const { communityId } = req.params;
      const result = await communityModel.deactivateCommunity(communityId);

      if (!result.value) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.json({
        message: "Community deactivated successfully",
        community: result.value,
      });
    } catch (error) {
      console.error("Deactivate Community Error:", error);
      res.status(500).json({ message: "Failed to deactivate community" });
    }
  }

  async getCommunityMembers(req, res) {
    try {
      const { communityId } = req.params;
      const members = await communityModel.getMembers(communityId);
      res.json(members);
    } catch (error) {
      console.error("Get Members Error:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  }
}

export default new CommunityController();
