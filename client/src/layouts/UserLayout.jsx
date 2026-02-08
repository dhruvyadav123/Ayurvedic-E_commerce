import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

export default function UserLayout() {
  return (
    <>
      <ScrollToTop /> {/* 👈 YAHI ADD KARNA HAI */}
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
