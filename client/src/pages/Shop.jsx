import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products & categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:3000/api/products");
        const productsData = Array.isArray(res.data) ? res.data : [];

        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories
        const cats = ["all", ...new Set(productsData.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Failed to load products 😔");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category or search
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, search, products]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-20 text-lg font-medium">
        Loading products...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg font-medium">
        {error}
      </div>
    );
  }

  // No products
  if (!filteredProducts.length) {
    return (
      <div className="text-center text-gray-500 mt-20 text-lg font-medium">
        No products found 😔
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
        Shop Products
      </h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
