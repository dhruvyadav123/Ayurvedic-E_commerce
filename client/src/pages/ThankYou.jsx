import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingBag, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <FaCheckCircle className="text-6xl text-emerald-600" />
          </div>
        </motion.div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-green-900 mb-4">Order Confirmed! 🎉</h1>
        <p className="text-gray-600 text-lg mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order Details */}
        <div className="bg-green-50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-green-900">#AYV{Math.floor(Math.random() * 10000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-bold text-green-900">5-7 Business Days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-bold text-green-900">Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-900 mb-4">What happens next?</h3>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p>We'll prepare your Ayurvedic products with care</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p>You'll receive a confirmation email with tracking details</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p>Your order will be delivered to your address</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all duration-300"
          >
            <FaHome />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-emerald-600 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {/* Contact Info */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-green-900 mb-4">Need Help?</h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              <FaWhatsapp />
              WhatsApp Support
            </a>
            <a
              href="mailto:support@ayurveda.com"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <FaEnvelope />
              Email Support
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Call us: <span className="font-semibold">+91 98765 43210</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}