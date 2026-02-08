const Order = require("../models/Order");

// 👉 PLACE ORDER (User OR Guest)
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!shippingAddress || !shippingAddress.name) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const order = await Order.create({
      user: req.user ? req.user._id : null, // ✅ SAFE
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 👉 ADMIN – ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👉 USER – my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  placeOrder,
  getAllOrders,
  getMyOrders,
};

