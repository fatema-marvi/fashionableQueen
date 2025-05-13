"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Info, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";


const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`mt-4 w-full z-40 transition-all duration-300 ${scrolled
          ? "bg-white shadow-lg py-2 border-b border-gray-200 top-8"
          : "bg-white/95 backdrop-blur-sm py-4 top-8"
        }`}
      style={{ top: '32px' }} // Matches SlideHeader height
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/logo.png"
              alt="Fashionable Queen Logo"
              className="h-20 w-20 md:h-20 md:w-20 lg:h-28 lg:w-28 object-contain transition-all duration-200"
            />
          <span className="md:text-2xl lg:text-3xl font-playfair font-bold tracking-wide italic transition-colors">
  <span className="text-pink-500">Fashionable</span>
  <span className="text-black">Queen</span>
</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link
                href="/trouser"
                className="text-gray-700 hover:text-rose-600 font-medium text-lg transition-colors"
              >
                Trousers
              </Link>
              <Link
                href="/stitch"
                className="text-gray-700 hover:text-rose-600 font-medium text-lg transition-colors"
              >
                Stitched
              </Link>
              <Link
                href="/unstitch"
                className="text-gray-700 hover:text-rose-600 font-medium text-lg transition-colors"
              >
                Unstitched
              </Link>
            </div>

            <div className="flex items-center space-x-6 ml-6">
              <Link
                href="/about"
                className="text-gray-600 hover:text-rose-600 transition-colors"
                title="About Us"
              >
                <Info size={22} />
              </Link>

              <Link
                href="https://wa.me/923232979158"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors"
                title="Contact on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </Link>

              <Link
                href="/cart"
                className="relative text-gray-600 hover:text-rose-600 transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-rose-600"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-rose-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/trouser"
            className="block py-2 text-gray-700 hover:text-rose-600 font-medium text-lg border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Trousers
          </Link>
          <Link
            href="/stitch"
            className="block py-2 text-gray-700 hover:text-rose-600 font-medium text-lg border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Stitched
          </Link>
          <Link
            href="/unstitch"
            className="block py-2 text-gray-700 hover:text-rose-600 font-medium text-lg border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Unstitched
          </Link>
          <Link
            href="/about"
            className="block py-2 text-gray-700 hover:text-rose-600 font-medium text-lg border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="https://wa.me/923232979158"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center py-2 text-gray-700 hover:text-rose-600 font-medium text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="mr-2 text-green-500"
            />
            WhatsApp
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;