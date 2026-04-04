'use client';

import React, { useState } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { label: 'Invest', href: '/invest' },
    { label: 'Book', href: '/recently-listed' },
    { label: 'Membership', href: '/membership' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/invest" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#0891B2] to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">H</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:inline">HouseDAO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive(link.href)
                    ? 'text-[#0891B2] bg-cyan-50'
                    : 'text-gray-700 hover:text-[#0891B2] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    My Portfolio
                  </Link>
                  <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    My Bookings
                  </Link>
                  <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    Messages
                  </Link>
                  <hr className="my-2" />
                  <Link href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Settings
                  </Link>
                  <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <Link
              href="/list-property"
              className="px-4 py-2 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              +
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 pb-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    isActive(link.href)
                      ? 'text-[#0891B2] bg-cyan-50'
                      : 'text-gray-700 hover:text-[#0891B2] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <hr className="my-4" />
            <Link
              href="#"
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              My Portfolio
            </Link>
            <Link
              href="#"
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              My Bookings
            </Link>
            <Link
              href="/list-property"
              className="block px-4 py-3 mt-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg text-center"
            >
              + Add Property
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
