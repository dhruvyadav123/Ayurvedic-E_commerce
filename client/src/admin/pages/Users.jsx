import { useEffect, useState } from "react";
import Table from "../components/Table";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [showAddModal, setShowAddModal] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // login se role store karna

  // 🔒 Route protection
  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied! Only admins can view this page.");
      window.location.href = "/"; // redirect normal user
    }
  }, [role]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Edit user submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${editUser._id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

  // Add new user submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        { ...newUser, adminKey: "secret123" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUser({ name: "", email: "", password: "" });
      setShowAddModal(false);
      fetchUsers(); // refresh table
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Add New User
        </button>
      </div>

      <Table headers={["Name", "Email", "Role", "Actions"]}>
        {users.map((user) => (
          <tr key={user._id}>
            <td className="p-3">{user.name}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">{user.role}</td>
            <td className="p-3 space-x-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => setEditUser(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
          >
            <h2 className="text-xl font-semibold">Edit User</h2>
            <input
              type="text"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 rounded bg-green-700 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
          >
            <h2 className="text-xl font-semibold">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 rounded bg-green-700 text-white">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
