const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const {
  placeOrder,
  getAllOrders,
  getMyOrders,
} = require("../controllers/orderController");

// USER
router.post("/place", auth, placeOrder);
router.get("/my", auth, getMyOrders); // ✅ MY ORDERS

// ADMIN
router.get("/", auth, admin, getAllOrders);

module.exports = router;
