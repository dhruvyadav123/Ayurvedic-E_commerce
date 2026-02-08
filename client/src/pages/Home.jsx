import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { addToCart } from "../utils/cart";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// assets
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";

import aboutImg from "../assets/about.jpg";

export default function Home() {
  const navigate = useNavigate();

  /* ================= SLIDER SETTINGS ================= */

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const productSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  /* ================= DATA ================= */

  const categories = [
    { title: "Herbal Supplements", img: "/images/supplements.jpg", slug: "supplements" },
    { title: "Ayurvedic Oils", img: "/images/oils.jpg", slug: "herbal-oil" },
    { title: "Organic Teas", img: "/images/tea.webp", slug: "tea" },
    { title: "Skin Care", img: "/images/skincares.webp", slug: "skin-care" },
    { title: "Immunity Boosters", img: "/images/immunity.jpg", slug: "immunity" },
  ];

  const products = [
    { id: 1, name: "Ayurvedic Juice", price: 499, image: product1 },
    { id: 2, name: "Herbal Oil", price: 699, image: product2 },
    { id: 3, name: "Organic Powder", price: 399, image: product3 },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-green-50">
        <Slider {...heroSettings}>
          {[hero1, hero2, hero3].map((img, index) => (
            <div key={index} className="max-w-7xl mx-auto px-6 py-16">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
                    Ayurvedic Products for Healthy Life 🌿
                  </h1>
                  <p className="text-green-800 mb-6">
                    Natural • Herbal • Trusted Wellness
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
                  >
                    Shop Now
                  </button>
                </div>

                <div className="md:w-1/2">
                  <img
                    src={img}
                    alt="Hero"
                    className="rounded-xl shadow-lg w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-14 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-900">
          Shop by Category
        </h2>

        <Slider {...categorySettings} className="px-6">
          {categories.map((cat) => (
            <div key={cat.slug} className="px-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="h-60 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <h3 className="text-xl font-bold">{cat.title}</h3>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-14 bg-green-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-900">
          Featured Products
        </h2>

        <Slider {...productSettings} className="px-6">
          {products.map((p) => (
            <div key={p.id} className="p-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-green-800">{p.name}</h3>
                  <p className="text-green-700 font-bold">₹{p.price}</p>
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-3 bg-green-900 text-white px-4 py-2 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <img
            src={aboutImg}
            alt="About"
            className="rounded-xl shadow-lg md:w-1/2"
          />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              About Our Brand
            </h2>
            <p className="text-green-800">
              Authentic Ayurvedic products crafted with purity, tradition and
              modern science for a healthier lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-14 bg-green-50 text-center px-6">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Subscribe Newsletter
        </h2>
        <div className="flex justify-center gap-4 flex-col sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="border px-4 py-2 rounded w-full sm:w-80"
          />
          <button className="bg-green-900 text-white px-6 py-2 rounded">
            Subscribe
          </button>
        </div>
      </section>
    </>
  );
}
