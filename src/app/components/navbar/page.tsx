"use client";

import { useState } from "react";
import { ShoppingCart, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 border-b border-gray-300">
      <div className="container max-w-screen-xl mx-auto px-4 flex items-center justify-between flex-wrap">
        {/* Logo */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <Link
    href="/"
    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[Playfair_Display] font-extrabold text-blue-700 tracking-wide italic hover:text-pink-900 transition duration-300"
  >
    ✨Fashionable Queen
  </Link>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </button>

        {/* Navigation Links */}
        <div className={`lg:flex space-x-4 ${isMenuOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0`}>
          <Link href="/trouser" className="text-pink-700 font-bold text-3xl hover:text-gray-900">
            Trouser
          </Link>
          <Link href="/stitch" className="text-pink-700 font-bold text-3xl hover:text-gray-900">
            Stitched
          </Link>
          <Link href="/unstitch" className="text-pink-700 font-bold text-3xl hover:text-gray-900">
            Unstitched
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* About */}
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            <Info size={24} />
          </Link>

          {/* WhatsApp */}
          <Link
            href="https://wa.me/923232979158"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700"
          >
            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
