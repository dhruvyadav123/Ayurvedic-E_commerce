import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  FaShoppingCart,
  FaStar,
  FaHeart,
  FaArrowLeft,
  FaLeaf,
  FaShieldAlt,
  FaShippingFast,
  FaCheck,
  FaWhatsapp,
} from "react-icons/fa";
import { FiMinus, FiPlus, FiShare2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:3000";

// Supports both slug-based and _id-based routes
// Route: /product/:slug  (slug can also be a MongoDB _id)
export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImg, setSelectedImg] = useState(0);
  const [imgError, setImgError] = useState(false);

  /* ── Fetch product by slug ── */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSelectedImg(0);
    setQuantity(1);

    // Try slug endpoint first; if backend uses _id, it still works via the same route
    axios
      .get(`${BASE_URL}/api/products/slug/${slug}`)
      .then((res) => {
        // Backend may return { product } or the product directly
        const data = res.data?.product || res.data;
        setProduct(data);
      })
      .catch(() => {
        // Fallback: try fetching by _id
        return axios
          .get(`${BASE_URL}/api/products/${slug}`)
          .then((res) => {
            const data = res.data?.product || res.data;
            setProduct(data);
          })
          .catch(() => {
            setError("Product not found.");
          });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Helpers ── */
  const getImageUrl = (img) => {
    if (!img || imgError)
      return "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=900&q=85&fit=crop";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product?.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied!", { position: "bottom-right", autoClose: 1500 });
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm">Loading product...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <FaLeaf className="text-6xl text-gray-200" />
        <p className="text-gray-500 font-semibold text-lg">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
        >
          <FaArrowLeft /> Back to Shop
        </button>
      </div>
    );
  }

  /* ── Derived values ── */
  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const rating = product.rating || 4.5;
  const reviews = product.reviews || 0;
  const inStock = product.inStock !== false;
  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">

        {/* ── Breadcrumb ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-emerald-600 transition">Shop</Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-gray-400">{product.category}</span>
              </>
            )}
            <span>/</span>
            <span className="text-green-900 font-medium truncate max-w-[160px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>

        {/* ── Main Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

            {/* ════ LEFT — Images ════ */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              {/* Main image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-white mb-3">
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                    -{discountPercent}% OFF
                  </div>
                )}

                <button
                  onClick={() => setWishlisted((p) => !p)}
                  className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-md border transition-all ${
                    wishlisted
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-gray-100 text-gray-400 hover:text-red-400"
                  }`}
                  aria-label="Wishlist"
                >
                  <FaHeart />
                </button>

                <img
                  src={getImageUrl(images[selectedImg])}
                  alt={product.name}
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="w-full h-72 sm:h-[420px] lg:h-[500px] object-cover"
                />

                {!inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-gray-800 text-white font-bold px-4 py-2 rounded-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImg === i
                          ? "border-emerald-500 shadow-md scale-105"
                          : "border-gray-200 opacity-60 hover:opacity-100 hover:border-emerald-200"
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ════ RIGHT — Details ════ */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Category badge */}
              {product.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full w-fit mb-3">
                  <FaLeaf className="text-emerald-500 text-[10px]" />
                  {product.category}
                </span>
              )}

              {/* Product name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      className={`text-sm ${
                        s <= Math.round(rating)
                          ? "text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="font-bold text-gray-700 text-sm ml-1">
                    {rating}
                  </span>
                </div>
                {reviews > 0 && (
                  <span className="text-gray-400 text-sm">
                    {reviews} reviews
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1.5">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {inStock ? "✓ In Stock" : "✗ Out of Stock"}
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition"
                    aria-label="Share"
                  >
                    <FiShare2 />
                  </button>
                </span>
              </div>

              {/* Price box */}
              <div className="flex items-baseline gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 mb-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-green-900">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {savings > 0 && (
                  <span className="ml-auto text-sm font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                    Save ₹{savings}
                  </span>
                )}
              </div>

              {/* Short description */}
              {product.description && (
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
                  {product.description}
                </p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700 min-w-fit">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 hover:bg-green-50 text-green-800 transition active:bg-green-100"
                    aria-label="Decrease"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-5 py-2.5 font-bold text-green-900 text-base border-x border-gray-200 min-w-[48px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2.5 hover:bg-green-50 text-green-800 transition active:bg-green-100"
                    aria-label="Increase"
                  >
                    <FiPlus />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Total:{" "}
                  <strong className="text-green-900 font-extrabold">
                    ₹{product.price * quantity}
                  </strong>
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-sm"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 active:scale-[0.98] disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-sm"
                >
                  Buy Now
                </button>
              </div>

              {/* WhatsApp order */}
              <a
                href={`https://wa.me/?text=I want to order ${product.name} - ₹${product.price} x ${quantity}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-700 hover:bg-green-50 py-3 rounded-xl font-semibold text-sm transition mb-7"
              >
                <FaWhatsapp className="text-green-500 text-lg" />
                Order via WhatsApp
              </a>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { icon: <FaLeaf />, label: "100% Natural" },
                  { icon: <FaShippingFast />, label: "Free Shipping" },
                  { icon: <FaShieldAlt />, label: "Quality Certified" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 text-center bg-green-50 rounded-xl p-3 border border-green-100"
                  >
                    <div className="text-emerald-600 text-base">{b.icon}</div>
                    <span className="text-[11px] sm:text-xs text-green-800 font-medium leading-tight">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Back link */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-emerald-700 text-sm transition w-fit"
              >
                <FaArrowLeft className="text-xs" /> Back
              </button>
            </motion.div>
          </div>

          {/* ════ TABS SECTION ════ */}
          <div className="mt-14 sm:mt-20">
            {/* Tab headers */}
            <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
              {[
                { key: "description", label: "Description" },
                { key: "benefits", label: "Benefits" },
                { key: "howToUse", label: "How to Use" },
                { key: "details", label: "Product Details" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.key
                      ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-transparent text-gray-500 hover:text-green-800 hover:bg-gray-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="max-w-3xl"
            >
              {/* Description */}
              {activeTab === "description" && (
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    {product.longDescription ||
                      product.description ||
                      "Experience the finest quality Ayurvedic formulation, crafted with pure natural ingredients sourced directly from nature. This product combines ancient Ayurvedic wisdom with modern quality standards to deliver the best results."}
                  </p>
                  {product.ingredients && (
                    <div className="mt-4">
                      <h4 className="font-bold text-green-900 mb-2">
                        Key Ingredients
                      </h4>
                      <p>{product.ingredients}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Benefits */}
              {activeTab === "benefits" && (
                <ul className="space-y-3">
                  {(
                    product.benefits || [
                      "Supports natural immunity and overall vitality",
                      "Made from 100% pure, natural herbal ingredients",
                      "Free from artificial colors, flavors and preservatives",
                      "Safe for daily use by healthy adults",
                      "Manufactured in GMP & ISO certified facility",
                      "Ethically sourced, sustainably produced",
                    ]
                  ).map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-emerald-600 text-[10px]" />
                      </div>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* How to Use */}
              {activeTab === "howToUse" && (
                <div className="space-y-4">
                  {(
                    product.howToUse || [
                      "Take as directed on the packaging or as advised by your healthcare practitioner.",
                      "Best consumed with warm water or milk.",
                      "For optimal results, use consistently for at least 30 days.",
                      "Store in a cool, dry place away from direct sunlight.",
                    ]
                  ).map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Product Details table */}
              {activeTab === "details" && (
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Product Name", product.name],
                        ["Category", product.category || "—"],
                        ["Price", `₹${product.price}`],
                        [
                          "Original Price",
                          product.originalPrice ? `₹${product.originalPrice}` : "—",
                        ],
                        ["Net Weight / Volume", product.weight || "As per packaging"],
                        ["Shelf Life", product.shelfLife || "24 months"],
                        ["Form", product.form || "—"],
                        [
                          "Manufacturer",
                          product.manufacturer || "Certified Ayurvedic Unit",
                        ],
                        ["Country of Origin", "India"],
                        ["Availability", inStock ? "In Stock" : "Out of Stock"],
                        ["SKU / Product ID", product.sku || product._id],
                      ].map(([key, val], i) => (
                        <tr
                          key={i}
                          className={
                            i % 2 === 0 ? "bg-green-50/60" : "bg-white"
                          }
                        >
                          <td className="px-4 sm:px-6 py-3 font-semibold text-green-900 w-40 sm:w-52 text-xs sm:text-sm">
                            {key}
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">
                            {val || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}