import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/products/slug";

export default function ProductDetails() {
  const { slug } = useParams();
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

  if (loading) return <Loader />;
  if (!product) return <Empty text="Product not found 😔" />;

  return (
    <div className="bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 bg-white rounded-xl shadow">
        
        <img
          src={product.image}
          className="w-full rounded-xl object-cover"
          alt={product.name}
        />

        <div>
          <h1 className="text-3xl font-bold text-green-800">
            {product.name}
          </h1>

          <p className="mt-3 text-gray-600">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{product.price}
          </p>

          <button className="mt-6 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full">
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
