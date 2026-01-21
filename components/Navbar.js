"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with hover effect */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110">
              <Image
                src="/Flag_of_Palestine.svg.png"
                alt="Palestine flag"
                width={32}
                height={32}
              />
            </div>
            <span className="font-bold text-xl text-gray-900 transition-colors group-hover:text-green-600">
              Palestine Stance
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/featured"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium rounded-lg transition-all hover:bg-green-50 relative group"
            >
              Featured
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/campaigns"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium rounded-lg transition-all hover:bg-green-50 relative group"
            >
              Campaigns
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium rounded-lg transition-all hover:bg-green-50 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button with animation */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  className="animate-in"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu with slide animation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/featured"
              className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Featured
            </Link>

            <Link
              href="/campaigns"
              className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>

            <Link
              href="/about"
              className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
