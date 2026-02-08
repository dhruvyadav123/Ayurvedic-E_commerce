import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Add product to cart
    addToCart(product);
    // Optional: toast/alert
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={`http://localhost:3000${product.image}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded-t-xl"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-green-700 font-bold">₹{product.price}</p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
