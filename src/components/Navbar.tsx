"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-auburn">Auburn</span>
            <span className="text-white">.cards</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="hover:text-auburn transition-colors">
              Shop
            </Link>
            <Link href="/trending" className="hover:text-auburn transition-colors">
              Trending
            </Link>
            <Link href="/deals" className="hover:text-auburn transition-colors">
              Deals
            </Link>
            <Link href="/sell" className="hover:text-auburn transition-colors">
              Sell Your Cards
            </Link>
            <Link
              href="https://www.instagram.com/auburn.cards"
              target="_blank"
              className="hover:text-auburn transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="https://ebay.us/m/u3T5kW"
              target="_blank"
              className="hover:text-auburn transition-colors"
            >
              eBay Store
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
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
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-light border-t border-white/10">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/shop"
              className="block hover:text-auburn transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/trending"
              className="block hover:text-auburn transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Trending
            </Link>
            <Link
              href="/deals"
              className="block hover:text-auburn transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Deals
            </Link>
            <Link
              href="/sell"
              className="block hover:text-auburn transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sell Your Cards
            </Link>
            <Link
              href="https://www.instagram.com/auburn.cards"
              target="_blank"
              className="block hover:text-auburn transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="https://ebay.us/m/u3T5kW"
              target="_blank"
              className="block hover:text-auburn transition-colors"
            >
              eBay Store
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
