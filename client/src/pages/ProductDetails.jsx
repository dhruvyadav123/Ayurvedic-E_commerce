import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const API = "http://localhost:3000/api/products/slug";

export default function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/${slug}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found 😔</div>;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-2xl"
        />

        {/* DETAILS */}
        <div>
          <h1 className="text-4xl font-bold text-green-900 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-amber-500" />
            <span className="font-semibold">{product.rating || 4.5}</span>
            <span className="text-gray-500 text-sm">
              ({product.reviews || 120} reviews)
            </span>
          </div>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-green-800">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-10 py-4 rounded-xl font-semibold flex items-center gap-3 hover:from-emerald-700 hover:to-green-800 transition"
          >
            <FaShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
