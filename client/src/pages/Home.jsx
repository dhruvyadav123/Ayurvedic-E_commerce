import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import { FaShoppingCart, FaStar, FaHeart, FaLeaf, FaShippingFast, FaShieldAlt, FaTag } from "react-icons/fa";
import { useCart } from "../context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";

// Assets
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import aboutImg from "../assets/about.jpg";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  /* ================= SLIDER SETTINGS ================= */
  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
  };

  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
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
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  /* ================= DYNAMIC DATA ================= */
  const categories = [
    { 
      id: 1, 
      title: "Herbal Supplements", 
      img: "https://images.unsplash.com/photo-1585435557343-3b092031c5a1?w=500&h=300&fit=crop", 
      slug: "supplements",
      count: "45+ Products",
      icon: <FaLeaf className="text-green-500 text-2xl" />
    },
    { 
      id: 2, 
      title: "Ayurvedic Oils", 
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop", 
      slug: "herbal-oil",
      count: "30+ Products",
      icon: <FaLeaf className="text-amber-600 text-2xl" />
    },
    { 
      id: 3, 
      title: "Organic Teas", 
      img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&h=300&fit=crop", 
      slug: "tea",
      count: "25+ Products",
      icon: <FaLeaf className="text-emerald-500 text-2xl" />
    },
    { 
      id: 4, 
      title: "Skin Care", 
      img: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=500&h=300&fit=crop", 
      slug: "skin-care",
      count: "60+ Products",
      icon: <FaLeaf className="text-pink-500 text-2xl" />
    },
    { 
      id: 5, 
      title: "Immunity Boosters", 
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop", 
      slug: "immunity",
      count: "35+ Products",
      icon: <FaLeaf className="text-red-500 text-2xl" />
    },
  ];

  const products = [
    { 
      id: 1, 
      name: "Ayurvedic Juice", 
      price: 499, 
      originalPrice: 699,
      discount: 29,
      image: product1, 
      category: "Immunity Boosters",
      rating: 4.5,
      reviews: 128,
      description: "Natural immunity booster with 21 herbs",
      inStock: true,
      isFeatured: true
    },
    { 
      id: 2, 
      name: "Herbal Oil", 
      price: 699, 
      originalPrice: 899,
      discount: 22,
      image: product2, 
      category: "Ayurvedic Oils",
      rating: 4.8,
      reviews: 256,
      description: "Pure herbal oil for joint pain relief",
      inStock: true,
      isFeatured: true
    },
    { 
      id: 3, 
      name: "Organic Powder", 
      price: 399, 
      originalPrice: 499,
      discount: 20,
      image: product3, 
      category: "Herbal Supplements",
      rating: 4.3,
      reviews: 89,
      description: "100% organic herbal powder",
      inStock: true,
      isFeatured: true
    },
    { 
      id: 4, 
      name: "Detox Tea", 
      price: 299, 
      originalPrice: 399,
      discount: 25,
      image: product1,
      category: "Organic Teas",
      rating: 4.7,
      reviews: 342,
      description: "Natural detoxifying herbal tea",
      inStock: true,
      isFeatured: true
    },
  ];

  const features = [
    { icon: <FaLeaf />, title: "100% Natural", desc: "Pure herbal ingredients" },
    { icon: <FaShippingFast />, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: <FaShieldAlt />, title: "Quality Certified", desc: "GMP & ISO certified" },
    { icon: <FaTag />, title: "Best Price", desc: "Price match guarantee" },
  ];

  /* ================= HANDLERS ================= */
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleWishlistToggle = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
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

  /* ================= ANIMATION VARIANTS ================= */
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <ToastContainer />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
        {/* Pattern background - Using inline SVG */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill="#059669" fillOpacity="0.1"/>
                <circle cx="50" cy="50" r="5" fill="#10b981" fillOpacity="0.15"/>
                <circle cx="80" cy="80" r="6" fill="#047857" fillOpacity="0.12"/>
                <circle cx="30" cy="70" r="4" fill="#065f46" fillOpacity="0.08"/>
                <circle cx="70" cy="30" r="7" fill="#134e4a" fillOpacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)"/>
          </svg>
        </div>
        
        <Slider {...heroSettings}>
          {[
            {
              img: hero1,
              title: "Pure Ayurvedic Wellness",
              subtitle: "Experience the healing power of nature",
              cta: "Explore Products"
            },
            {
              img: hero2,
              title: "Organic Herbal Solutions",
              subtitle: "Traditional wisdom, modern science",
              cta: "Shop Now"
            },
            {
              img: hero3,
              title: "Natural Living",
              subtitle: "Transform your health naturally",
              cta: "Discover More"
            }
          ].map((slide, index) => (
            <div key={index}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:w-1/2 text-center lg:text-left"
                  >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight">
                      {slide.title} <span className="text-emerald-600">🌿</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-green-800 mb-8 max-w-2xl">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button
                        onClick={() => navigate("/products")}
                        className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                      >
                        {slide.cta}
                      </button>
                      <button
                        onClick={() => navigate("/categories")}
                        className="border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300"
                      >
                        View Categories
                      </button>
                    </div>
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="text-emerald-600">{feature.icon}</div>
                          <span className="text-sm text-green-800">{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="lg:w-1/2 relative"
                  >
                    <div className="relative">
                      <img
                        src={slide.img}
                        alt="Hero"
                        className="rounded-2xl shadow-2xl w-full h-[400px] sm:h-[500px] object-cover"
                      />
                      <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                        <div className="text-3xl font-bold text-emerald-700">5000+</div>
                        <div className="text-green-800">Happy Customers</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-green-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl text-emerald-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-green-900 mb-2">{feature.title}</h3>
                <p className="text-green-700 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Explore our wide range of authentic Ayurvedic products
            </p>
          </motion.div>

          <Slider {...categorySettings}>
            {categories.map((cat) => (
              <div key={cat.id} className="px-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
                      {cat.count}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      {cat.icon}
                      <h3 className="text-xl font-bold">{cat.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200">Shop Now</span>
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
              Featured Products
            </h2>
            <p className="text-green-700">Best selling Ayurvedic products</p>
          </motion.div>

          <Slider {...productSettings}>
            {products.map((product) => (
              <div key={product.id} className="px-3">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        className={`p-2 rounded-full ${wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-600'} hover:bg-red-50 hover:text-red-500 transition-colors`}
                      >
                        <FaHeart className={wishlist.includes(product.id) ? 'fill-red-500' : ''} />
                      </button>
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-emerald-600 font-semibold">{product.category}</span>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-amber-500" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-green-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-4 py-3 border border-emerald-600 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/products")}
              className="border-2 border-emerald-600 text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative">
                <img
                  src={aboutImg}
                  alt="About"
                  className="rounded-3xl shadow-2xl w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold text-emerald-700">25+</div>
                  <div className="text-green-800">Years of Experience</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-6">
                Our Promise of Purity & Authenticity
              </h2>
              <p className="text-green-800 mb-6">
                For over two decades, we've been dedicated to bringing you the purest Ayurvedic products, 
                combining ancient wisdom with modern scientific validation.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "100% Natural & Herbal Ingredients",
                  "GMP & ISO Certified Manufacturing",
                  "Traditional Ayurvedic Formulations",
                  "Rigorous Quality Testing",
                  "Sustainable & Ethical Sourcing"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-green-800">{item}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate("/about")}
                className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all duration-300"
              >
                Learn More About Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-green-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join Our Wellness Journey
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Subscribe to get exclusive offers, health tips, and updates on new products
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-6 py-4 rounded-xl w-full sm:w-96 text-green-900 placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="submit"
                className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors duration-300 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
            
            <p className="text-emerald-200 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
} 