import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchOrders(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900 mb-8 text-center md:text-left">
          All Orders 📦
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 rounded-xl">
              <thead className="bg-green-100">
                <tr>
                  <th className="border px-4 py-2">Order ID</th>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Items</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-green-50">
                    <td className="border px-2 py-2">{order._id || "N/A"}</td>
                    <td className="border px-2 py-2">{order.user?.name || "Unknown"}</td>
                    <td className="border px-2 py-2">
                      {order.items?.map((i) => `${i?.name || "Unknown"} × ${i?.qty || 0}`).join(", ") || "N/A"}
                    </td>
                    <td className="border px-2 py-2">₹{order.totalAmount || 0}</td>
                    <td className="border px-2 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="border px-2 py-2 space-x-2">
                      {order.status !== "Completed" && (
                        <button
                          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                          onClick={() => updateStatus(order._id, "Completed")}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
