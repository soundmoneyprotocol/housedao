'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4 sm:mb-6">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Booking Confirmed!</h1>

        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-2">
          Your booking has been successfully created and payment has been processed. A confirmation email has been sent to your inbox.
        </p>

        <div className="bg-[#D946EF]/10 border border-[#D946EF]/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 font-bold">What's next?</p>
          <ul className="text-left space-y-2 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#D946EF] font-bold mt-0.5">✓</span>
              <span>Check your email for confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D946EF] font-bold mt-0.5">✓</span>
              <span>View your booking in profile</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D946EF] font-bold mt-0.5">✓</span>
              <span>Receive reminder notifications</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/invest"
            className="block py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/30 transition text-sm sm:text-base"
          >
            Browse More Properties
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
