import User from "../models/userModel.js";
import AdminModel from "../models/adminModel.js";
import { clearCookie, setCookie } from "../utils/cookies.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, setHashPassword } from "../utils/password.js";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../utils/validation.js";
import { saveBase64Image } from "./base64ImageUploader.js";

export const authController = {
  async register(req, res) {
    try {
      const {
        fullName,
        password,
        community,
        email,
        confirmPassword,
        contactNumber,
        address,
        location,
        profileImage,
      } = req.body;
      if (
        !fullName ||
        !email ||
        !contactNumber ||
        !password ||
        !address ||
        !confirmPassword ||
        !community
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters with uppercase, lowercase and number",
        });
      }

      if (!validatePhone(Number(contactNumber))) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      const emailExists = await User.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const phoneExists = await User.findByPhone(contactNumber);
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already registered" });
      }

      const hashPassword = await setHashPassword(password);
      const image = await saveBase64Image(profileImage);

      const userData = {
        password: hashPassword,
        fullName,
        email,
        contactNumber,
        location,
        address,
        community,
        profilePicture: image.success ? image.url : "",
      };

      const user = await User.createUser(userData);
      delete user.password;

      const token = generateToken(user._id);
      setCookie(res, token);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      delete user.password;

      const token = generateToken(user._id);
      setCookie(res, token);
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  },

  async logout(req, res) {
    try {
      clearCookie(res);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  },
};

async function defaultSuperAdminRegister() {
  const email = process.env.SUPER_ADMIN_EMAIL;

  if (!validateEmail(email)) {
    return;
  }

  const emailExists = await AdminModel.findByEmail(email);
  if (emailExists) {
    return;
  }

  const hashPassword = await setHashPassword(process.env.SUPER_ADMIN_PASS);
  const superAdmin = {
    email,
    password: hashPassword,
    fullName: "Super Admin",
  };

  await AdminModel.registerSuperAdmin(superAdmin);
  return "Success";
}

export const adminController = {
  async register(req, res) {
    const adminRole = req.admin?.role;

    if (adminRole !== "super_admin") {
      return res
        .status(401)
        .json({ message: "unauthorize to perform operation" });
    }

    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
        department,
        role,
      } = req.body;

      if (
        !username ||
        !email ||
        !password ||
        !confirmPassword ||
        !fullName ||
        !phoneNumber ||
        department
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters with uppercase, lowercase and number",
        });
      }

      if (!validatePhone(Number(phoneNumber))) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      const emailExists = await AdminModel.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashPassword = await setHashPassword(password);
      const adminData = {
        username,
        email,
        password: hashPassword,
        fullName,
        phoneNumber,
        department,
        role: role || "admin",
      };

      const admin = await AdminModel.createAdmin(adminData);
      delete admin.password;

      const token = generateToken(admin._id);
      setCookie(res, token);

      res.status(201).json({ admin, token });
    } catch (error) {
      console.error("Admin Registration Error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      await defaultSuperAdminRegister();

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const admin = await AdminModel.findByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await comparePassword(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await AdminModel.updateLastLogin(admin._id);
      delete admin.password;

      const token = generateToken(admin._id);
      setCookie(res, token);

      res.json({ admin, token });
    } catch (error) {
      console.error("Admin Login Error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  },

  async logout(req, res) {
    try {
      clearCookie(res);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Admin Logout Error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  },

  async getProfile(req, res) {
    try {
      const admin = req.admin;

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      delete admin.password;
      res.json({ admin });
    } catch (error) {
      console.error("Get Admin Profile Error:", error, req.admin);
      res.status(500).json({ message: "Failed to fetch admin profile" });
    }
  },

  async updateProfile(req, res) {
    try {
      const adminId = req.admin._id;
      const { fullName, phoneNumber, department } = req.body;

      const updates = {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(department && { department }),
      };

      const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, updates);

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      delete updatedAdmin.password;
      res.json({ admin: updatedAdmin });
    } catch (error) {
      console.error("Update Admin Profile Error:", error);
      res.status(500).json({ message: "Failed to update admin profile" });
    }
  },
};
