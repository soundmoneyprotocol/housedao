'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to VVS landing page
    redirect('/vvs');
  }, []);

  // Fallback while redirect processes
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">VVS Flawless</h1>
        <p className="text-gray-600 mb-8">A Private Oceanfront Villa Experience</p>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
