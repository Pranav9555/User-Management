const mongoose = require("mongoose");
const User = require("../models/User");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "A user with this email already exists",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
};

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/users/stats
exports.getUserStats = async (req, res) => {
  try {
    const [total, active, inactive] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "Active" }),
      User.countDocuments({ status: "Inactive" }),
    ]);

    res.status(200).json({ total, active, inactive });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, phone, status } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await User.create({
      name,
      email,
      role,
      phone,
      status,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, role, phone, status } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phone, status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      id: user._id,
    });
  } catch (error) {
    handleError(res, error);
  }
};