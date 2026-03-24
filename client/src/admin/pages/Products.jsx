// Products.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSpinner, 
  FaPlus, 
  FaRupeeSign, 
  FaTag, 
  FaBox, 
  FaStar,
  FaEye,
  FaTimes,
  FaCheck,
  FaImage,
  FaUpload,
  FaArrowLeft
} from "react-icons/fa";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api/products";

export default function Products({ refresh }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Add Product Form State
  const [addForm, setAddForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      const productsData = Array.isArray(res.data) ? res.data : [];
      setProducts(productsData);
      
      const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, categoryFilter, priceRange, sortBy, products]);

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }
    
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  // Add Product Functions
  const validateAddForm = () => {
    const newErrors = {};
    if (!addForm.name.trim()) newErrors.name = "Product name is required";
    if (!addForm.price || addForm.price <= 0) newErrors.price = "Valid price is required";
    if (!addForm.stock || addForm.stock < 0) newErrors.stock = "Valid stock quantity is required";
    if (!addForm.category.trim()) newErrors.category = "Category is required";
    if (!addForm.image && !preview) newErrors.image = "Product image is required";
    
    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }
      
      setAddForm({ ...addForm, image: file });
      setPreview(URL.createObjectURL(file));
      if (addErrors.image) setAddErrors({ ...addErrors, image: null });
    } else {
      setAddForm({ ...addForm, [name]: value });
      if (addErrors[name]) setAddErrors({ ...addErrors, [name]: null });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setAddForm({ ...addForm, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAddForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    setAddLoading(true);

    try {
      const data = new FormData();
      Object.keys(addForm).forEach((k) => {
        if (addForm[k] !== null && addForm[k] !== undefined) {
          data.append(k, addForm[k]);
        }
      });

      await axios.post(API, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully! 🎉");
      
      // Reset form
      setAddForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: null,
      });
      setPreview(null);
      setAddErrors({});
      setShowAddModal(false);
      fetchProducts();
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setAddLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === undefined) return { status: "info", text: "Unknown", color: "bg-gray-100 text-gray-600" };
    if (stock === 0) return { status: "out", text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (stock < 10) return { status: "low", text: "Low Stock", color: "bg-yellow-100 text-yellow-600" };
    return { status: "in", text: "In Stock", color: "bg-green-100 text-green-600" };
  };

  const productCategories = [
    "Herbs", "Oils", "Tablets", "Powders", "Juices", 
    "Capsules", "Creams", "Teas", "Supplements", "Other"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your product catalog, inventory, and pricing</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <FaPlus /> Add New Product
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBox className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaTag className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter(p => p.stock !== undefined && p.stock < 10 && p.stock > 0).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{(products.reduce((sum, p) => sum + (p.price || 0), 0) / (products.length || 1)).toFixed(0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
                <button
                  onClick={handleAddProduct}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
                >
                  <FaPlus /> Add Your First Product
                </button>
              </div>
            ) : (
              filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={product.image ? `http://localhost:3000${product.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleQuickView(product)}
                          className="bg-white text-green-700 px-4 py-2 rounded-full flex items-center gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                          <FaEye /> Quick View
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.category || "Uncategorized"}
                        </span>
                        <span className="text-sm font-bold text-green-700 flex items-center gap-1">
                          <FaRupeeSign size={12} /> {product.price}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id, product.name)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Table Footer */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 px-4 py-3 bg-white rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>Showing {filteredProducts.length} of {products.length} products</p>
              <p>Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-4 sticky top-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaPlus /> Add New Product
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <p className="text-green-100 text-sm mt-1">Fill in the details to add a new product</p>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBox className="text-gray-400" />
                    </div>
                    <input
                      name="name"
                      value={addForm.name}
                      onChange={handleAddChange}
                      placeholder="Enter product name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        addErrors.name 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {addErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{addErrors.name}</p>
                  )}
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRupeeSign className="text-gray-400" />
                      </div>
                      <input
                        name="price"
                        type="number"
                        value={addForm.price}
                        onChange={handleAddChange}
                        placeholder="e.g., 199"
                        step="0.01"
                        min="0"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          addErrors.price 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-green-500"
                        }`}
                      />
                    </div>
                    {addErrors.price && (
                      <p className="text-red-500 text-xs mt-1">{addErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBox className="text-gray-400" />
                      </div>
                      <input
                        name="stock"
                        type="number"
                        value={addForm.stock}
                        onChange={handleAddChange}
                        placeholder="e.g., 50"
                        min="0"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          addErrors.stock 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-green-500"
                        }`}
                      />
                    </div>
                    {addErrors.stock && (
                      <p className="text-red-500 text-xs mt-1">{addErrors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="text-gray-400" />
                    </div>
                    <select
                      name="category"
                      value={addForm.category}
                      onChange={handleAddChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition appearance-none ${
                        addErrors.category 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {productCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  {addErrors.category && (
                    <p className="text-red-500 text-xs mt-1">{addErrors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={addForm.description}
                    onChange={handleAddChange}
                    rows="3"
                    placeholder="Enter product description, benefits, usage instructions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition ${
                      dragActive 
                        ? "border-green-500 bg-green-50" 
                        : addErrors.image 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleAddChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {preview ? (
                      <div className="space-y-3">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                          <FaCheck /> Image uploaded successfully
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setAddForm({ ...addForm, image: null });
                          }}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <FaUpload className="text-4xl text-gray-400 mx-auto" />
                        <p className="text-gray-600">
                          Drag and drop an image here, or click to select
                        </p>
                        <p className="text-sm text-gray-400">
                          Supports: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  {addErrors.image && (
                    <p className="text-red-500 text-xs mt-1">{addErrors.image}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className={`flex-1 px-4 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition ${
                      addLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700"
                    }`}
                  >
                    {addLoading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <FaPlus /> Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={fetchProducts}
        />
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProduct.image ? `http://localhost:3000${selectedProduct.image}` : "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
                <button
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mt-1">{selectedProduct.category || "Uncategorized"}</p>
                  </div>
                  <div className="text-2xl font-bold text-green-700 flex items-center gap-1">
                    <FaRupeeSign /> {selectedProduct.price}
                  </div>
                </div>
                
                {selectedProduct.description && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Stock Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockStatus(selectedProduct.stock).color}`}>
                      {getStockStatus(selectedProduct.stock).text}
                    </span>
                  </div>
                  {selectedProduct.stock !== undefined && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Quantity</h3>
                      <p className="text-gray-600">{selectedProduct.stock} units</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowQuickView(false);
                      setEditProduct(selectedProduct);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaEdit /> Edit Product
                  </button>
                  <button
                    onClick={() => {
                      deleteProduct(selectedProduct._id, selectedProduct.name);
                      setShowQuickView(false);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}