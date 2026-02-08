const express = require("express");
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   res.json(user);
// });


module.exports = router;
