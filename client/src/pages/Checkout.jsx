import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });

  // AUTH CHECK + CART EMPTY CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue checkout");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }
  }, [navigate, cartItems]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        paymentMethod: form.payment,
        totalAmount: total,
      };

      await axios.post(
        "http://localhost:3000/api/orders/place",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      clearCart();
      window.dispatchEvent(new Event("cartUpdated"));

      alert("✅ Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-10 px-4">
      <motion.form
        onSubmit={placeOrder}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl grid grid-cols-1 lg:grid-cols-3 overflow-hidden"
      >
        {/* LEFT FORM */}
        <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
          <h2 className="text-3xl font-bold text-green-800">Checkout 🌿</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Mobile Number" name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <Input label="Address" name="address" value={form.address} onChange={handleChange} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="State" name="state" value={form.state} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
          </div>

          {/* PAYMENT */}
          <div>
            <p className="font-semibold mb-2">Payment Method</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={form.payment === "online"}
                  onChange={handleChange}
                />
                Online
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-lg transition disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order 🛒"}
          </button>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-green-800 text-white p-6 md:p-8">
          <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

          <div className="space-y-4 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr className="opacity-30" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <p className="text-xs mt-6 opacity-80">
            🌿 Authentic Ayurvedic Products  
            <br />
            🚚 Fast & Safe Delivery
          </p>
        </div>
      </motion.form>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        required
        className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        {...props}
      />
    </div>
  );
}
