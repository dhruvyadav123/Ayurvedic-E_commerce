import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f3d2e] via-[#145a32] to-[#1e8449] text-white mt-16">
      
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            🌿 Ayurveda
          </h2>
          <p className="text-sm text-green-100 mt-3 leading-relaxed">
            Pure & authentic Ayurvedic products crafted for a healthier,
            natural lifestyle.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <SocialIcon><FaFacebookF /></SocialIcon>
            <SocialIcon><FaInstagram /></SocialIcon>
            <SocialIcon><FaTwitter /></SocialIcon>
            <SocialIcon><FaYoutube /></SocialIcon>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/shop">Shop</FooterLink>
            <FooterLink to="/cart">Cart</FooterLink>
            <FooterLink to="/login">Login</FooterLink>
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <p className="text-sm text-green-100">📞 +91 98765 43210</p>
          <p className="text-sm text-green-100 mt-1">
            📧 support@ayurveda.com
          </p>
          <p className="text-sm text-green-100 mt-2">
            ⏰ Mon – Sat: 9AM – 7PM
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#0b2e22] text-center text-sm py-4 text-green-200">
        © {new Date().getFullYear()} Ayurveda. Crafted with 🌿 for healthy living.
      </div>
    </footer>
  );
}

/* 🔹 REUSABLE COMPONENTS */
function SocialIcon({ children }) {
  return (
    <span className="w-9 h-9 flex items-center justify-center rounded-full 
      bg-white/10 hover:bg-white hover:text-green-700 
      transition cursor-pointer">
      {children}
    </span>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="hover:text-white hover:translate-x-1 transition inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
