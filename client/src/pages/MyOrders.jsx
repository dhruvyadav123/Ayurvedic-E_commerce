import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/orders/my";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-800 font-semibold text-lg">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p className="text-lg mb-4">You have no orders yet 😔</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900 mb-10 text-center">
          My Orders 📦
        </h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-xl p-6">
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4">
                <div className="space-y-1">
                  <p className="font-semibold text-green-900">
                    Order ID: <span className="text-gray-600">{order._id || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                <span
                  className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2 border-t border-b border-green-100 py-2">
                {order.items?.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm md:text-base">
                      <span>{item?.name || "Unknown"} × {item?.qty || 0}</span>
                      <span>₹{(item?.price || 0) * (item?.qty || 0)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items in this order</p>
                )}
              </div>

              {/* TOTAL */}
              <div className="flex justify-between font-bold text-green-900 text-base mt-4">
                <span>Total</span>
                <span>₹{order.totalAmount || 0}</span>
              </div>

              {/* PAYMENT METHOD */}
              <p className="text-sm text-gray-600 mt-2">
                Payment: {order.paymentMethod?.toUpperCase() || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
