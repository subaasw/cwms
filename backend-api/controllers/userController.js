import User from "../models/userModel.js";
import { saveBase64Image } from "./base64ImageUploader.js";

export const userController = {
  async getProfile(req, res) {
    try {
      const user = req.user;
      delete user.password;

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  },

  async updateProfile(req, res) {
    try {
      const user = req.user;
      const updates = {};
      const { fullName, address, contactNumber, email, profilePicture } =
        req.body;

      if (fullName) {
        updates.fullName = fullName;
      }
      if (address) {
        updates.address = address;
      }
      if (contactNumber) {
        updates.contactNumber = contactNumber;
      }
      if (email) {
        if (email !== user.email) {
          const existingEmail = await User.findByEmail(email);

          if (existingEmail) {
            res.status(400).json({ message: "Email address already exists" });
            return;
          }
        }

        updates.email = email;
      }
      if (profilePicture) {
        const image = await saveBase64Image(profilePicture);

        if (image.success) {
          updates.profilePicture = image.url;
        }
      }

      const userData = await User.findByIdAndUpdate(user._id, updates);
      delete userData.password;
      res.json({ user: userData });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  },
};
