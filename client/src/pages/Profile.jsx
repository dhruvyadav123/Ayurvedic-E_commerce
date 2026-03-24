// Profile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Stats data
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    offers: 0,
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
      setEditForm({
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        phone: response.data.user.phone || "",
        address: response.data.user.address || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else {
        setError("Failed to load profile data");
      }
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      // You can create separate API endpoints for stats
      // For now, using mock data
      setStats({
        orders: 12,
        wishlist: 5,
        offers: 3,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/auth/profile",
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(response.data.user);
      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleNavigateToOrders = () => {
    navigate("/orders");
  };

  const handleNavigateToWishlist = () => {
    navigate("/wishlist");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-6 text-center"
          >
            <div className="relative">
              <img
                src={userData?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="User"
                className="w-32 h-32 mx-auto rounded-full border-4 border-green-600 shadow-md object-cover"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-1/3 bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition"
              >
                <FaEdit size={12} />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-green-800 mt-4">
              {userData?.name || "User Name"}
            </h2>
            <p className="text-gray-500">{userData?.bio || "Ayurveda Lover 🌿"}</p>
            <p className="text-sm text-green-600 mt-1">Member since {new Date(userData?.createdAt).getFullYear() || "2024"}</p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="cursor-pointer hover:bg-green-50 rounded-lg p-2 transition" onClick={handleNavigateToOrders}>
                <p className="text-xl font-bold text-green-700">{stats.orders}</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div className="cursor-pointer hover:bg-green-50 rounded-lg p-2 transition" onClick={handleNavigateToWishlist}>
                <p className="text-xl font-bold text-green-700">{stats.wishlist}</p>
                <p className="text-sm text-gray-500">Wishlist</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-700">{stats.offers}</p>
                <p className="text-sm text-gray-500">Offers</p>
              </div>
            </div>

            {/* Verification Badge */}
            {userData?.isVerified && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCheckCircle /> Verified Account
              </div>
            )}
          </motion.div>

          {/* RIGHT DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Success/Error Messages */}
            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center gap-2">
                <FaCheckCircle /> {updateSuccess}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl flex items-center gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-green-800">
                {isEditing ? "Edit Profile" : "Profile Details"}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              // Display Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Detail icon={<FaUser />} label="Full Name" value={userData?.name || "Not set"} />
                <Detail icon={<FaEnvelope />} label="Email" value={userData?.email || "Not set"} />
                <Detail icon={<FaPhone />} label="Mobile" value={userData?.phone || "Not set"} />
                <Detail icon={<FaMapMarkerAlt />} label="Address" value={userData?.address || "Not set"} />
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditField
                    label="Full Name"
                    name="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    icon={<FaUser />}
                    required
                  />
                  <EditField
                    label="Email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    icon={<FaEnvelope />}
                    required
                  />
                  <EditField
                    label="Mobile"
                    name="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    icon={<FaPhone />}
                  />
                  <EditField
                    label="Address"
                    name="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    icon={<FaMapMarkerAlt />}
                    multiline
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" /> Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: userData?.name || "",
                        email: userData?.email || "",
                        phone: userData?.phone || "",
                        address: userData?.address || "",
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionButton
                icon={<FaShoppingBag />}
                text="My Orders"
                color="bg-green-700"
                onClick={handleNavigateToOrders}
              />
              <ActionButton
                icon={<FaHeart />}
                text="Wishlist"
                color="bg-yellow-500"
                onClick={handleNavigateToWishlist}
              />
              <ActionButton
                icon={<FaEdit />}
                text="Update Profile"
                color="bg-emerald-600"
                onClick={() => setIsEditing(true)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Detail Component
function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="text-green-700 text-xl mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} hover:opacity-90 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg`}
    >
      {icon} {text}
    </button>
  );
}

// Edit Field Component
function EditField({ label, name, type = "text", value, onChange, icon, required = false, multiline = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-green-600">{icon}</span>
        </div>
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        )}
      </div>
    </div>
  );
}