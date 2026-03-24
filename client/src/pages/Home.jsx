import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import {
  FaShoppingCart,
  FaStar,
  FaHeart,
  FaLeaf,
  FaShippingFast,
  FaShieldAlt,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";

/* ─── Sharp, high-res Unsplash images (no local blurry assets) ─── */

// Hero slides
const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&q=90&fit=crop",
    title: "Pure Ayurvedic Wellness",
    subtitle: "Experience the healing power of nature's finest herbs",
    cta: "Explore Products",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop",
    title: "Organic Herbal Solutions",
    subtitle: "Traditional wisdom validated by modern science",
    cta: "Shop Now",
  },
  {
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=90&fit=crop",
    title: "Natural Living",
    subtitle: "Transform your health the natural way",
    cta: "Discover More",
  },
];

// Categories
const CATEGORIES = [
  {
    id: 1,
    title: "Herbal Supplements",
    img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=85&fit=crop",
    slug: "supplements",
    count: "45+ Products",
    color: "from-green-700",
  },
  {
    id: 2,
    title: "Ayurvedic Oils",
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85&fit=crop",
    slug: "herbal-oil",
    count: "30+ Products",
    color: "from-amber-700",
  },
  {
    id: 3,
    title: "Organic Teas",
    img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=85&fit=crop",
    slug: "tea",
    count: "25+ Products",
    color: "from-emerald-700",
  },
  {
    id: 4,
    title: "Skin Care",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85&fit=crop",
    slug: "skin-care",
    count: "60+ Products",
    color: "from-pink-700",
  },
  {
    id: 5,
    title: "Immunity Boosters",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85&fit=crop",
    slug: "immunity",
    count: "35+ Products",
    color: "from-red-700",
  },
];

// Products — all sharp Unsplash photos
const PRODUCTS = [
  {
    id: 1,
    name: "Ayurvedic Juice",
    price: 499,
    originalPrice: 699,
    discount: 29,
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=85&fit=crop",
    category: "Immunity Boosters",
    rating: 4.5,
    reviews: 128,
    description: "Natural immunity booster with 21 powerful herbs",
    inStock: true,
  },
  {
    id: 2,
    name: "Herbal Oil",
    price: 699,
    originalPrice: 899,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=85&fit=crop",
    category: "Ayurvedic Oils",
    rating: 4.8,
    reviews: 256,
    description: "Pure herbal oil for joint pain relief",
    inStock: true,
  },
  {
    id: 3,
    name: "Organic Powder",
    price: 399,
    originalPrice: 499,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=85&fit=crop",
    category: "Herbal Supplements",
    rating: 4.3,
    reviews: 89,
    description: "100% organic herbal powder blend",
    inStock: true,
  },
  {
    id: 4,
    name: "Detox Tea",
    price: 299,
    originalPrice: 399,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=85&fit=crop",
    category: "Organic Teas",
    rating: 4.7,
    reviews: 342,
    description: "Natural detoxifying herbal tea",
    inStock: true,
  },
];

const FEATURES = [
  { icon: <FaLeaf />, title: "100% Natural", desc: "Pure herbal ingredients" },
  {
    icon: <FaShippingFast />,
    title: "Free Shipping",
    desc: "On orders above ₹999",
  },
  {
    icon: <FaShieldAlt />,
    title: "Quality Certified",
    desc: "GMP & ISO certified",
  },
  {
    icon: <FaTag />,
    title: "Best Price",
    desc: "Price match guarantee",
  },
];

/* ─── Custom Slider Arrows ─── */
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-green-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200"
    aria-label="Previous"
  >
    <FaChevronLeft className="text-sm sm:text-base" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-green-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200"
    aria-label="Next"
  >
    <FaChevronRight className="text-sm sm:text-base" />
  </button>
);

/* ─── Fade animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  /* ─── Slider settings ─── */
  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "cubic-bezier(0.7,0,0.3,1)",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <div className="!bottom-4">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false, dots: true } },
    ],
  };

  const productSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  /* ─── Handlers ─── */
  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    if (!wishlist.includes(productId)) {
      toast.info("Added to wishlist", {
        position: "bottom-right",
        autoClose: 1500,
      });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success("Thank you for subscribing!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setNewsletterEmail("");
    }
  };

  return (
    <>
      <ToastContainer />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-green-950">
        <Slider {...heroSettings}>
          {HERO_SLIDES.map((slide, idx) => (
            <div key={idx} className="relative">
              {/* Crisp background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.img})`,
                  imageRendering: "crisp-edges",
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
                <div className="max-w-xl lg:max-w-2xl">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm px-3 py-1 rounded-full mb-4 font-medium tracking-wide"
                  >
                    🌿 Authentic Ayurveda
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="text-base sm:text-lg text-emerald-100 mb-6 sm:mb-8"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-col xs:flex-row gap-3"
                  >
                    <button
                      onClick={() => navigate("/products")}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-emerald-900/40"
                    >
                      {slide.cta}
                    </button>
                    <button
                      onClick={() => navigate("/categories")}
                      className="border border-white/40 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
                    >
                      Browse Categories
                    </button>
                  </motion.div>

                  {/* Mini stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-8 sm:mt-12 flex flex-wrap gap-4 sm:gap-8"
                  >
                    {[
                      { val: "5000+", label: "Happy Customers" },
                      { val: "150+", label: "Products" },
                      { val: "25+", label: "Years Experience" },
                    ].map((s, i) => (
                      <div key={i}>
                        <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                          {s.val}
                        </div>
                        <div className="text-xs sm:text-sm text-emerald-200">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center bg-green-50 hover:bg-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-md"
              >
                <div className="text-2xl sm:text-3xl text-emerald-600 mb-2 sm:mb-3">
                  {f.icon}
                </div>
                <h3 className="font-bold text-green-900 text-sm sm:text-base mb-1">
                  {f.title}
                </h3>
                <p className="text-green-700 text-xs sm:text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-green-700 text-sm sm:text-base max-w-xl mx-auto">
              Explore our authentic Ayurvedic product range
            </p>
          </motion.div>

          <div className="relative">
            <Slider {...categorySettings}>
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="px-2 sm:px-3">
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer group h-56 sm:h-64"
                  >
                    {/* Crisp image */}
                    <img
                      src={cat.img}
                      alt={cat.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ imageRendering: "auto" }}
                    />
                    {/* Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${cat.color}/70 to-transparent`}
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-2 py-1 rounded-full text-xs font-semibold">
                      {cat.count}
                    </div>
                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                      <h3 className="text-base sm:text-lg font-bold mb-1">
                        {cat.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-white/80 flex items-center gap-1">
                        Shop Now <span>→</span>
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-900 mb-3">
              Featured Products
            </h2>
            <p className="text-green-700 text-sm sm:text-base">
              Best selling Ayurvedic products
            </p>
          </motion.div>

          <div className="relative">
            <Slider {...productSettings}>
              {PRODUCTS.map((product) => (
                <div key={product.id} className="px-2 sm:px-3">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 sm:h-56">
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold z-10">
                          -{product.discount}%
                        </div>
                      )}
                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow transition-colors ${
                          wishlist.includes(product.id)
                            ? "bg-red-50 text-red-500"
                            : "bg-white/90 text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <FaHeart />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ imageRendering: "auto" }}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-emerald-600 font-semibold">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-amber-400 text-xs" />
                          <span className="text-xs font-bold text-gray-700">
                            {product.rating}
                          </span>
                          <span className="text-gray-400 text-xs">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-green-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 flex-1">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-xl font-extrabold text-green-900">
                            ₹{product.price}
                          </span>
                          <span className="text-gray-400 line-through text-xs">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                          In Stock
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FaShoppingCart />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="px-3 py-2.5 border border-emerald-600 text-emerald-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <button
              onClick={() => navigate("/products")}
              className="border-2 border-emerald-600 text-emerald-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors text-sm sm:text-base"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=90&fit=crop"
                  alt="About our company"
                  loading="lazy"
                  decoding="async"
                  className="rounded-3xl shadow-2xl w-full h-72 sm:h-96 lg:h-[480px] object-cover"
                  style={{ imageRendering: "auto" }}
                />
                <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                    25+
                  </div>
                  <div className="text-green-800 text-sm">Years of Trust</div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-900 mb-5">
                Our Promise of Purity & Authenticity
              </h2>
              <p className="text-green-800 mb-6 text-sm sm:text-base leading-relaxed">
                For over two decades, we've been dedicated to bringing you the
                purest Ayurvedic products — combining ancient wisdom with
                modern scientific validation.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "100% Natural & Herbal Ingredients",
                  "GMP & ISO Certified Manufacturing",
                  "Traditional Ayurvedic Formulations",
                  "Rigorous Quality Testing",
                  "Sustainable & Ethical Sourcing",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 min-w-[8px] bg-emerald-600 rounded-full" />
                    <span className="text-green-800 text-sm sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/about")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
              >
                Learn More About Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-emerald-900 to-green-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4">
              Join Our Wellness Journey
            </h2>
            <p className="text-emerald-100 mb-6 sm:mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Subscribe to get exclusive offers, health tips, and updates on new
              products
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-5 py-3.5 sm:py-4 rounded-xl w-full sm:w-80 text-green-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                Subscribe Now
              </button>
            </form>

            <p className="text-emerald-300 text-xs sm:text-sm mt-4">
              By subscribing, you agree to our Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}