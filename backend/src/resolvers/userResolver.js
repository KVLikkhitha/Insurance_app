import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const userResolvers = {
  Query: {
    users: async (_, __, { currentUser }) => {
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Not authorized");
      }
      return await User.find({});
    },

    user: async (_, { id }, { currentUser }) => {
      if (!currentUser) throw new Error("Not authenticated");
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");

      if (currentUser.role === "admin" || currentUser.userId === id) {
        return user;
      }
      throw new Error("Not authorized");
    },

    me: async (_, __, { currentUser }) => {
      if (!currentUser) throw new Error("Not authenticated");
      return await User.findById(currentUser.userId);
    },
  },

  Mutation: {
    register: async (_, { input }) => {
      const { name, email, password, role } = input;

      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("Email already in use");

      const user = new User({ name, email, password, role: role || "customer" });
      await user.save();
      return user;
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid email or password");

      const valid = await user.comparePassword(password);
      if (!valid) throw new Error("Invalid email or password");

      // Use environment variable directly
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "48h" }
      );

      return { token, user };
    },

    updateUser: async (_, { id, input }, { currentUser }) => {
      if (!currentUser) throw new Error("Not authenticated");

      if (currentUser.role !== "admin" && currentUser.userId !== id) {
        throw new Error("Not authorized");
      }

      const updates = { ...input };
      if (input.password) {
        updates.password = await bcrypt.hash(input.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    },

    deleteUser: async (_, { id }, { currentUser }) => {
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Not authorized");
      }
      const deleted = await User.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};
