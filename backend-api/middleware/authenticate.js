import { verifyToken } from "../utils/jwt.js";
import User from "../models/userModel.js";
import AdminModel from "../models/adminModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid session" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }

    const decoded = verifyToken(token);
    const admin = await AdminModel.findById(decoded.userId);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid session" });
  }
};
