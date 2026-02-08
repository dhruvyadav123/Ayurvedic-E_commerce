import React from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-6 text-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className="w-32 h-32 mx-auto rounded-full border-4 border-green-600 shadow-md"
          />

          <h2 className="text-2xl font-bold text-green-800 mt-4">
            Rahul Sharma
          </h2>
          <p className="text-gray-500">Ayurveda Lover 🌿</p>

          <button className="mt-4 inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full transition">
            <FaEdit /> Edit Profile
          </button>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-xl font-bold text-green-700">12</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-700">5</p>
              <p className="text-sm text-gray-500">Wishlist</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-700">3</p>
              <p className="text-sm text-gray-500">Offers</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-green-800 mb-6">
            Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail icon={<FaUser />} label="Full Name" value="Rahul Sharma" />
            <Detail
              icon={<FaEnvelope />}
              label="Email"
              value="rahul@gmail.com"
            />
            <Detail
              icon={<FaPhone />}
              label="Mobile"
              value="+91 98765 43210"
            />
            <Detail
              icon={<FaMapMarkerAlt />}
              label="Address"
              value="Delhi, India"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionButton
              icon={<FaShoppingBag />}
              text="My Orders"
              color="bg-green-700"
            />
            <ActionButton
              icon={<FaHeart />}
              text="Wishlist"
              color="bg-yellow-500"
            />
            <ActionButton
              icon={<FaEdit />}
              text="Update Profile"
              color="bg-emerald-600"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */
function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4">
      <div className="text-green-700 text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon, text, color }) {
  return (
    <button
      className={`${color} hover:opacity-90 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition`}
    >
      {icon} {text}
    </button>
  );
}
