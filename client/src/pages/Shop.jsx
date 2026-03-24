import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiPackage } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import ProductCard from "../components/product/ProductCard";

const API = "http://localhost:3000/api/products";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Fetch products from backend ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(API);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setFilteredProducts(data);
        const cats = ["all", ...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ── Client-side filter ── */
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, search, products]);

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
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-white">

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white py-12 sm:py-16 px-4 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <FaLeaf className="text-emerald-400" />
            <span className="text-emerald-300 text-sm font-semibold tracking-wider uppercase">
              Authentic Ayurveda
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-200 text-sm sm:text-base"
          >
            {products.length} handcrafted Ayurvedic products
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── Search + Select ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
          </div>

          {/* Category dropdown */}
          <div className="relative min-w-[180px]">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none cursor-pointer transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </motion.div>

        {/* ── Category Pills ── */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                {cat === "all" ? "🌿 All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Result count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-green-800">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {selectedCategory !== "all" && (
              <span>
                {" "}in{" "}
                <span className="font-semibold text-emerald-700">
                  {selectedCategory}
                </span>
              </span>
            )}
          </p>
          {(search || selectedCategory !== "all") && (
            <button
              onClick={() => { setSearch(""); setSelectedCategory("all"); }}
              className="text-xs text-red-400 hover:text-red-600 transition font-medium"
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {/* ── Product Grid / Empty State ── */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <FiPackage className="text-7xl text-gray-200 mb-5" />
              <p className="text-gray-400 font-semibold text-lg mb-2">
                No products found
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Try a different search or category
              </p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
              >
                Show All Products
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
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}