import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/products";

export default function ProductEditModal({ product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image: null,
  });

  const [preview, setPreview] = useState(
    product.image ? `http://localhost:3000${product.image}` : null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("stock", form.stock);
    data.append("category", form.category);
    if (form.image) data.append("image", form.image);

    try {
      await axios.put(`${API}/${product._id}`, data);
      onUpdate();   // refresh product list
      onClose();    // close modal
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Edit Product 🌿
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Category */}
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Image */}
          <div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
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

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
