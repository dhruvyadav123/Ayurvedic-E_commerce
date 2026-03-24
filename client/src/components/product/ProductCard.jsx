import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar, FaHeart, FaEye } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3000";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    _id,
    slug,
    name,
    price,
    originalPrice,
    discount,
    image,
    category,
    rating = 4.5,
    reviews = 0,
    description,
    inStock = true,
  } = product;

  // Support both absolute URLs and relative /uploads/... paths from backend
  const imageUrl = imgError
    ? "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&q=85&fit=crop"
    : image?.startsWith("http")
    ? image
    : `${BASE_URL}${image}`;

  // Use slug if backend provides it, else fallback to _id
  const detailPath = slug ? `/product/${slug}` : `/product/${_id}`;

  const discountPercent =
    discount ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    toast.success(`${name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    toast.info(wishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      position: "bottom-right",
      autoClose: 1500,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-green-100/80 overflow-hidden flex flex-col h-full"
    >
      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden bg-green-50">
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
            -{discountPercent}%
          </div>
        )}

        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full shadow border transition-all duration-200 ${
            wishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white/90 border-gray-100 text-gray-400 hover:text-red-400"
          }`}
        >
          <FaHeart className="text-xs" />
        </button>

        <Link to={detailPath} className="block">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* View Details hover overlay */}
        <div className="absolute inset-0 bg-green-900/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={detailPath}
            className="flex items-center gap-2 bg-white text-green-900 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg hover:bg-emerald-50 transition-colors"
          >
            <FaEye className="text-emerald-600" />
            View Details
          </Link>
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── INFO ── */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-1.5">
          {category && (
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full truncate max-w-[58%]">
              {category}
            </span>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            <FaStar className="text-amber-400 text-xs" />
            <span className="text-xs font-bold text-gray-700 ml-0.5">
              {rating}
            </span>
            {reviews > 0 && (
              <span className="text-gray-400 text-[11px] hidden sm:inline ml-0.5">
                ({reviews})
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <Link to={detailPath}>
          <h3 className="font-bold text-sm sm:text-base text-green-900 mb-1 line-clamp-1 hover:text-emerald-700 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-[11px] sm:text-xs mb-3 line-clamp-2 flex-1 leading-relaxed">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-extrabold text-green-900">
            ₹{price}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-gray-400 line-through text-xs">
              ₹{originalPrice}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] text-red-500 font-semibold ml-auto">
              Save ₹{originalPrice - price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
          >
            <FaShoppingCart className="text-[11px]" />
            Add to Cart
          </button>

          <Link
            to={detailPath}
            className="flex items-center justify-center gap-1 px-3 py-2.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
          >
            <FaEye className="text-[11px]" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}