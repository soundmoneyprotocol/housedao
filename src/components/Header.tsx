'use client';

import React, { useState } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { label: 'Invest', href: '/invest' },
    { label: 'Book', href: '/recently-listed' },
    { label: 'Membership', href: '/membership' },
    { label: 'About', href: '/about' },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    router.push('/login');
    setIsProfileOpen(false);
  };

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
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <Link href="/portfolio" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        My Portfolio
                      </Link>
                      <Link href="/bookings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        My Bookings
                      </Link>
                      <Link href="/messages" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        Messages
                      </Link>
                      <hr className="my-2" />
                      <Link href="/settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4 inline mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
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
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-[#0891B2] font-semibold hover:text-cyan-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
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
            {user ? (
              <>
                <Link
                  href="/portfolio"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Portfolio
                </Link>
                <Link
                  href="/bookings"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  href="/messages"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 mt-2 text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 mt-2 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              href="/list-property"
              className="block px-4 py-3 mt-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              + Add Property
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
