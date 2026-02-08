import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/products";

export default function AddProduct({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => data.append(k, form[k]));

      await axios.post(API, data);

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });
      setPreview(null);

      if (onSuccess) onSuccess();
      alert("✅ Product added successfully");
    } catch (err) {
      alert("❌ Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-green-800">
          Add New Product 🌿
        </h2>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 199"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Juice / Tablet / Oil"
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Product Image
          </label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-100 file:text-green-700
              hover:file:bg-green-200"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-40 w-full object-cover rounded-xl border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
