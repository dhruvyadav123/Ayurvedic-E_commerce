import { useEffect, useState } from "react";
import axios from "axios";
import ProductEditModal from "./ProductEditModal";

const API = "http://localhost:3000/api/products";

export default function Products({ refresh }) {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow mt-8">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-green-100 text-green-800">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-500">
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p._id}
                className="text-center border-t hover:bg-green-50"
              >
                <td className="p-3">
                  <img
                    src={`http://localhost:3000${p.image}`}
                    className="h-12 w-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 font-semibold">₹{p.price}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditProduct(p)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={fetchProducts}
        />
      )}
    </div>
  );
}
