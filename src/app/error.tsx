'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#D946EF] mb-4">Oops!</h1>
        <p className="text-2xl text-white mb-2">Something went wrong</p>
        <p className="text-neutral-400 mb-8 max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/50 transition"
          >
            Try Again
          </button>
          <Link
            href="/invest"
            className="px-6 py-3 bg-neutral-700 text-white font-bold rounded-lg hover:bg-neutral-600 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
