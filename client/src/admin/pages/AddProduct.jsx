// AddProduct.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaBox, 
  FaRupeeSign, 
  FaTag, 
  FaImage, 
  FaSpinner, 
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaUpload
} from "react-icons/fa";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api/products";

export default function AddProduct({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.stock || form.stock < 0) newErrors.stock = "Valid stock quantity is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.image && !preview) newErrors.image = "Product image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
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
      
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
      if (errors.image) setErrors({ ...errors, image: null });
    } else {
      setForm({ ...form, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: null });
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
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== null && form[k] !== undefined) {
          data.append(k, form[k]);
        }
      });

      await axios.post(API, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully! 🎉");
      
      // Reset form
      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: null,
      });
      setPreview(null);
      setErrors({});

      if (onSuccess) onSuccess();
      
      // Optional: Navigate back after 2 seconds
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
      
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Herbs", "Oils", "Tablets", "Powders", "Juices", 
    "Capsules", "Creams", "Teas", "Supplements", "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition" />
            <span>Back to Products</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={submit}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaPlus /> Add New Product
              </h2>
              <p className="text-green-100 text-sm mt-1">
                Fill in the details to add a new product to your catalog
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
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
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                      errors.name 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g., 199"
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        errors.price 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
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
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="e.g., 50"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        errors.stock 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Category with Dropdown */}
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
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition appearance-none ${
                      errors.category 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
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
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition ${
                    dragActive 
                      ? "border-green-500 bg-green-50" 
                      : errors.image 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300 hover:border-green-500"
                  }`}
                >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {preview ? (
                    <div className="space-y-3">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-48 w-full object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                        <FaCheckCircle /> Image uploaded successfully
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setForm({ ...form, image: null });
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
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
              </div>

              {/* Preview Info */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 text-green-700">
                    <FaCheckCircle />
                    <span className="text-sm font-medium">Image ready for upload</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Adding Product...
                  </>
                ) : (
                  <>
                    <FaSave /> Add Product
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
          >
            <h3 className="font-semibold text-green-800 mb-2">💡 Pro Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use high-quality images to attract more customers</li>
              <li>• Provide detailed descriptions highlighting benefits</li>
              <li>• Set competitive prices based on market research</li>
              <li>• Keep track of stock levels to avoid out-of-stock situations</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}