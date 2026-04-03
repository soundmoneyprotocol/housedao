'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function BookingCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4 sm:mb-6">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Payment Cancelled</h1>

        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-2">
          Your payment was cancelled. Your booking was not confirmed. You can try again or contact support if you need assistance.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-red-900 mb-2 font-bold">Important</p>
          <p className="text-xs sm:text-sm text-red-800">
            No charges have been made to your account. You can safely attempt to book again.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/invest"
            className="block py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/30 transition text-sm sm:text-base"
          >
            Browse Properties Again
          </Link>
          <Link
            href="/"
            className="block py-2 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-gray-400 transition text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
