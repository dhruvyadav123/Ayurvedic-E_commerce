import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Offers from "../pages/Offers";
import Products from "../pages/Products";
import Register from "../pages/Register";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProductDetails from "../pages/ProductDetails";
import CategoryPage from "../pages/CategoryPage";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import AdminRoutes from "../admin/AdminRoutes";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= USER SIDE ================= */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Products />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-orders" element={<MyOrders />} />


          {/* 🔐 PROTECTED PAGE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= REDIRECT ================= */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl">
              404 | Page Not Found
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
