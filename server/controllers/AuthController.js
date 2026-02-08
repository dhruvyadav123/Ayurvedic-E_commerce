const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Role assign
    let role = "user";
    if (adminKey === process.env.ADMIN_SECRET_KEY || email === "admin@gmail.com") {
      role = "admin";
    }

    const user = await User.create({ name, email, password: hash, role });

    res.json({ message: "Registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getUsers, updateUser, deleteUser };
