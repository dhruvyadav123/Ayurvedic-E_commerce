import { useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function Profile() {
  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "admin@mail.com",
    avatar: "https://i.pravatar.cc/150?img=3", // default avatar
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: admin.name,
    email: admin.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    setAdmin({ ...admin, name: form.name, email: form.email });
    setEditMode(false);
    alert("✅ Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start py-10 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={admin.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4 border-4 border-green-200"
          />

          {!editMode ? (
            <>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {admin.name}
              </h2>
              <p className="text-gray-600 mb-4">{admin.email}</p>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            </>
          ) : (
            <div className="w-full mt-4 space-y-4">
              <div>
                <label className="text-gray-700 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
