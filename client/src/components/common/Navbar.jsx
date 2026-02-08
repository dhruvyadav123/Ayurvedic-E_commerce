import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { cartCount } from "../../utils/cart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const profileRef = useRef(null);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold"
      : "hover:text-yellow-200";

  // 🔁 UPDATE CART COUNT
  useEffect(() => {
    setCount(cartCount());
  }, [location.pathname]);

  // BODY SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // AUTO CLOSE ON ROUTE CHANGE
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // CLOSE PROFILE ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-800 text-white sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <NavLink to="/" className="text-2xl font-bold flex items-center gap-2">
            🌿 Ayurveda
          </NavLink>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/category/:slug" className={linkClass}>Categories</NavLink>
            <NavLink to="/products" className={linkClass}>Products</NavLink>
            <NavLink to="/offers" className={linkClass}>Offers</NavLink>
            <NavLink to="/checkout" className={linkClass}>Checkout</NavLink>
             {/* <NavLink to="/checkout" className={linkClass}>Checkout</NavLink> */}

            {/* CART */}
            <NavLink to="/cart" className="relative text-xl">
              <FaShoppingCart />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {count}
                </span>
              )}
            </NavLink>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="text-2xl"
              >
                <FaUserCircle />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg">
                  <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </NavLink>
                  <NavLink to="/my-orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </NavLink>
                  <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-100">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="block px-4 py-2 hover:bg-gray-100">
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button onClick={() => setOpen(true)} className="md:hidden text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-green-800 z-40 transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full overflow-y-auto p-6">
          <button
            onClick={() => setOpen(false)}
            className="text-2xl mb-6"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-5 text-lg">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/products">Categories</NavLink>
            <NavLink to="/offers">Offers</NavLink>
            <NavLink to="/checkout">Checkout</NavLink>

            <hr className="border-green-600 my-4" />

            {/* MOBILE CART */}
            <NavLink to="/cart" className="flex justify-between items-center">
              🛒 Cart
              {count > 0 && (
                <span className="bg-red-500 text-xs px-2 rounded-full">
                  {count}
                </span>
              )}
            </NavLink>

            <NavLink to="/my-orders">📦 My Orders</NavLink>

            <hr className="border-green-600 my-4" />

            <NavLink to="/profile">👤 Profile</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </nav>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}
    </nav>
  );
}
