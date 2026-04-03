'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to invest page on load
    router.push('/invest');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">HomeDAO</h1>
        <p className="text-neutral-400 mb-8">Fractional Real Estate Social Network</p>
        <p className="text-neutral-500">Redirecting to invest page...</p>
      </div>
    </div>
  );
}
