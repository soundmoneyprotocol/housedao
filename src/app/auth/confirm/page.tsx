'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || !type) {
          setError('Invalid confirmation link');
          setLoading(false);
          return;
        }

        // Verify the token
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (verifyError) {
          setError(verifyError.message || 'Failed to verify email');
          toast.error('Email verification failed');
        } else {
          setSuccess(true);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        toast.error('Verification error');
      } finally {
        setLoading(false);
      }
    };

    handleConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0891B2] to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HouseDAO</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          {loading ? (
            <>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-6 h-6 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we confirm your email address...</p>
            </>
          ) : success ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">Your email has been confirmed. Redirecting to login...</p>
              <Link
                href="/login"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-center block"
              >
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{error || 'We could not verify your email. Please try again.'}</p>
              <Link
                href="/signup"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-center block mb-3"
              >
                Back to Sign Up
              </Link>
              <Link
                href="/login"
                className="w-full py-3 px-4 border-2 border-[#0891B2] text-[#0891B2] font-bold rounded-lg hover:bg-cyan-50 transition text-center block"
              >
                Try Logging In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
