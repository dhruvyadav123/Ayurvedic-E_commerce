import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/add-product", label: "Add Product" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/profile", label: "Profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-green-800 text-white p-6
        transform transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">
          🌿 AyurAdmin
        </h1>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-lg">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded transition-colors duration-200 ${
                  isActive
                    ? "bg-green-600 text-yellow-300 font-semibold"
                    : "hover:bg-green-700 hover:text-yellow-100"
                }`
              }
              onClick={() => setOpen(false)} // close sidebar on mobile
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
