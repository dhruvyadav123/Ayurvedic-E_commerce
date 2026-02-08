import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-green-50 py-10 px-4 flex items-center justify-center">
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty 😔</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-8 text-center">
          Your Shopping Cart 🛒
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: PRODUCTS */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-5 bg-white rounded-xl shadow p-4"
              >
                <img
                  src={`http://localhost:3000${item.image}`}
                  alt={item.name}
                  className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-lg"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">{item.name}</h3>
                    <p className="text-green-700 font-medium">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="w-8 h-8 bg-green-100 text-green-900 rounded font-bold hover:bg-green-200"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="w-8 h-8 bg-green-100 text-green-900 rounded font-bold hover:bg-green-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 text-sm font-semibold hover:underline"
                  >
                    Remove
                  </button>
                  <p className="font-bold text-green-900 mt-2 sm:mt-auto">
                    ₹{item.price * item.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-green-900 mb-4">Order Summary</h2>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold text-green-900 mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
