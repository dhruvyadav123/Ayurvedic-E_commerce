// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaChartLine,
  FaCalendarAlt,
  FaStar,
  FaUserPlus,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaDownload,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      products: 0,
      orders: 0,
      users: 0,
      revenue: 0,
    },
    recentOrders: [],
    topProducts: [],
    recentUsers: [],
    salesData: [],
    categoryData: [],
    alerts: [],
  });
  const [dateRange, setDateRange] = useState("weekly");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // Check if user is admin
      if (role !== "admin") {
        navigate("/profile");
        return;
      }

      // Fetch real data from backend
      const [statsRes, ordersRes, productsRes, usersRes, salesRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/recent-orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/top-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/recent-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:3000/api/admin/sales-data?range=${dateRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDashboardData({
        stats: statsRes.data,
        recentOrders: ordersRes.data,
        topProducts: productsRes.data,
        recentUsers: usersRes.data,
        salesData: salesRes.data.sales,
        categoryData: salesRes.data.categories,
        alerts: salesRes.data.alerts || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use mock data for demo
      setDashboardData({
        stats: {
          products: 124,
          orders: 356,
          users: 1248,
          revenue: 325000,
        },
        recentOrders: [
          { id: "ORD-001", customer: "Rahul Sharma", amount: 2499, status: "delivered", date: "2024-01-15" },
          { id: "ORD-002", customer: "Priya Patel", amount: 1899, status: "processing", date: "2024-01-14" },
          { id: "ORD-003", customer: "Amit Kumar", amount: 4599, status: "shipped", date: "2024-01-14" },
          { id: "ORD-004", customer: "Neha Singh", amount: 1299, status: "pending", date: "2024-01-13" },
          { id: "ORD-005", customer: "Vikram Mehta", amount: 3499, status: "delivered", date: "2024-01-12" },
        ],
        topProducts: [
          { name: "Ashwagandha Powder", sales: 245, revenue: 49000 },
          { name: "Triphala Tablets", sales: 189, revenue: 28350 },
          { name: "Brahmi Oil", sales: 156, revenue: 23400 },
          { name: "Neem Capsules", sales: 134, revenue: 20100 },
          { name: "Tulsi Drops", sales: 112, revenue: 16800 },
        ],
        recentUsers: [
          { name: "Rahul Sharma", email: "rahul@example.com", joined: "2024-01-15", orders: 3 },
          { name: "Priya Patel", email: "priya@example.com", joined: "2024-01-14", orders: 1 },
          { name: "Amit Kumar", email: "amit@example.com", joined: "2024-01-14", orders: 2 },
          { name: "Neha Singh", email: "neha@example.com", joined: "2024-01-13", orders: 1 },
        ],
        salesData: [
          { name: "Mon", sales: 4000, orders: 24 },
          { name: "Tue", sales: 3000, orders: 18 },
          { name: "Wed", sales: 5000, orders: 32 },
          { name: "Thu", sales: 4500, orders: 28 },
          { name: "Fri", sales: 6000, orders: 42 },
          { name: "Sat", sales: 5500, orders: 38 },
          { name: "Sun", sales: 4800, orders: 30 },
        ],
        categoryData: [
          { name: "Herbs", value: 35 },
          { name: "Oils", value: 25 },
          { name: "Tablets", value: 20 },
          { name: "Powders", value: 15 },
          { name: "Others", value: 5 },
        ],
        alerts: [
          { type: "warning", message: "Low stock: Ashwagandha Powder (Only 10 left)" },
          { type: "info", message: "New order received #ORD-006" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100";
      case "processing": return "text-blue-600 bg-blue-100";
      case "shipped": return "text-purple-600 bg-purple-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AyurAdmin
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-sm text-gray-500">Welcome back,</span>
                <span className="text-sm font-semibold text-green-700">Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-green-700 transition"
                >
                  <FaBell size={20} />
                  {dashboardData.alerts.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {dashboardData.alerts.map((alert, idx) => (
                        <div key={idx} className="p-3 border-b hover:bg-gray-50">
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      ))}
                      {dashboardData.alerts.length === 0 && (
                        <p className="p-3 text-gray-500 text-center">No new notifications</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings & Logout */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <FaCog className="text-gray-600" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                    >
                      <FaSignOutAlt /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="daily">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
              <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center space-x-2">
                <FaDownload /> <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Products"
            value={dashboardData.stats.products}
            icon={<FaBox />}
            color="bg-blue-500"
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.stats.orders}
            icon={<FaShoppingCart />}
            color="bg-green-500"
            trend="+8%"
            trendUp={true}
          />
          <StatCard
            title="Total Users"
            value={dashboardData.stats.users}
            icon={<FaUsers />}
            color="bg-purple-500"
            trend="+15%"
            trendUp={true}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(dashboardData.stats.revenue / 1000).toFixed(1)}K`}
            icon={<FaRupeeSign />}
            color="bg-yellow-500"
            trend="+23%"
            trendUp={true}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sales Overview</h3>
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a" }} />
                <Line type="monotone" dataKey="orders" stroke="#eab308" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">₹{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 text-center">
              <button className="text-green-600 hover:text-green-700 font-semibold">View All Orders →</button>
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {dashboardData.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">New Users</h3>
              <FaUserPlus className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}