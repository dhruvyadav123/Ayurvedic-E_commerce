import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaArrowLeft, FaFilter } from "react-icons/fa";
import { FiSearch, FiPackage } from "react-icons/fi";
import ProductCard from "../components/product/ProductCard";

const API = "http://localhost:3000/api/products/category";

// Category-wise banner colors & icons
const CATEGORY_THEMES = {
  supplements:   { from: "from-green-800",   to: "to-emerald-600", emoji: "🌿" },
  "herbal-oil":  { from: "from-amber-800",   to: "to-yellow-600",  emoji: "🫒" },
  tea:           { from: "from-teal-800",    to: "to-cyan-600",    emoji: "🍵" },
  "skin-care":   { from: "from-pink-800",    to: "to-rose-500",    emoji: "🌸" },
  immunity:      { from: "from-red-800",     to: "to-orange-500",  emoji: "🛡️" },
  default:       { from: "from-emerald-900", to: "to-green-700",   emoji: "🌱" },
};

// Prettier display names
const CATEGORY_LABELS = {
  supplements:  "Herbal Supplements",
  "herbal-oil": "Ayurvedic Oils",
  tea:          "Organic Teas",
  "skin-care":  "Skin Care",
  immunity:     "Immunity Boosters",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts]           = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [search, setSearch]               = useState("");
  const [sort, setSort]                   = useState("default");

  const theme = CATEGORY_THEMES[slug] || CATEGORY_THEMES.default;
  const label = CATEGORY_LABELS[slug] || slug?.replace(/-/g, " ");

  /* ── Fetch products by category ── */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSearch("");
    setSort("default");

    axios
      .get(`${API}/${slug}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
        setError("Failed to load products. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Client-side search + sort ── */
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating")     result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "discount")   result.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    setFiltered(result);
  }, [search, sort, products]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm">Loading products...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <FiPackage className="text-6xl text-red-200" />
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">

      {/* ── Hero Banner ── */}
      <div className={`bg-gradient-to-r ${theme.from} ${theme.to} text-white relative overflow-hidden`}>
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cdots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="18" cy="18" r="1.8" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cdots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-5 flex-wrap">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white transition">Shop</Link>
            <span>/</span>
            <span className="text-white/90 font-medium capitalize">{label}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl">{theme.emoji}</span>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold capitalize leading-tight"
              >
                {label}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/70 text-sm mt-1"
              >
                {products.length} product{products.length !== 1 ? "s" : ""} available
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── Search + Sort bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder={`Search in ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
          </div>

          {/* Sort */}
          <div className="relative min-w-[180px]">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none cursor-pointer transition"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Best Discount</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </motion.div>

        {/* ── Result info + clear ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-green-800">{filtered.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-green-800">{products.length}</span>{" "}
            products
          </p>
          {(search || sort !== "default") && (
            <button
              onClick={() => { setSearch(""); setSort("default"); }}
              className="text-xs text-red-400 hover:text-red-600 transition font-medium"
            >
              Reset ✕
            </button>
          )}
        </div>

        {/* ── Grid / Empty ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <span className="text-6xl mb-4">{theme.emoji}</span>
              <p className="text-gray-400 font-semibold text-lg mb-2">
                {search ? "No products match your search" : "No products in this category"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => navigate("/shop")}
                className="mt-3 flex items-center gap-2 text-gray-400 hover:text-emerald-600 text-sm transition"
              >
                <FaArrowLeft className="text-xs" /> Browse all products
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Back to Shop ── */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            <FaArrowLeft className="text-xs" />
            Back to All Products
          </button>
        </div>
      </div>
    </div>
  );
}