import React from "react";
import { motion } from "framer-motion";

const offers = [
  {
    title: "Flat 20% OFF",
    desc: "On all Ayurvedic Juices",
    code: "JUICE20",
    color: "from-green-600 to-green-400",
  },
  {
    title: "Buy 1 Get 1",
    desc: "On Selected Tablets",
    code: "B1G1TAB",
    color: "from-yellow-500 to-yellow-400",
  },
  {
    title: "Up to ₹500 OFF",
    desc: "On Herbal Oils",
    code: "OIL500",
    color: "from-emerald-600 to-emerald-400",
  },
  {
    title: "Special Skin Care Deal",
    desc: "Flat 30% OFF",
    code: "SKIN30",
    color: "from-lime-600 to-lime-400",
  },
];

export default function Offers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-10 px-4">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10"
      >
        Today’s Offers 🎉
      </motion.h1>

      {/* OFFERS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${offer.color} text-white rounded-2xl shadow-lg p-6 relative overflow-hidden`}
          >
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full"></div>

            <h2 className="text-2xl font-bold mb-2">
              {offer.title}
            </h2>
            <p className="mb-4 text-white/90">{offer.desc}</p>

            <div className="bg-white text-green-800 inline-block px-4 py-2 rounded-lg font-semibold mb-4">
              Code: {offer.code}
            </div>

            <button className="block w-full bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-green-100 transition">
              Shop Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
