const router = require("express").Router();
const Product = require("../models/Product");
const multer = require("multer");

const {
  addProduct,
  getProducts,
  getProductsByCategory,
  deleteProduct,
  updateProduct, // ✅ import
} = require("../controllers/productController");

// slug generator (tumhara hi rakha)
const makeSlug = (text) =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ADD PRODUCT */
router.post("/", upload.single("image"), addProduct);

/* GET ALL PRODUCTS */
router.get("/", getProducts);

/* GET BY CATEGORY */
router.get("/category/:slug", getProductsByCategory);

/* ✅ UPDATE PRODUCT (MISSING PART ADDED) */
router.put("/:id", upload.single("image"), updateProduct);

/* DELETE */
router.delete("/:id", deleteProduct);

module.exports = router;
