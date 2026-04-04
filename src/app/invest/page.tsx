'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Vote, Share2, Calendar, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Header from "../../components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { isMobileDevice } from "@/lib/deviceDetect";

interface Property {
  id: string;
  blockchainId?: number;
  name: string;
  city: string;
  latitude: string;
  longitude: string;
  description: string;
  imageUrl: string;
  valuationUsd: number;
  annualYieldPercentage: number;
  sharesOutstanding?: number;
  maxShareSupply: number;
  isArtistHouse: boolean;
  isBookable?: boolean;
  hourlyRate?: number;
  dailyRate?: number;
  createdAt?: string;
}

interface PropertyWithMetrics extends Property {
  roi: number;
  pricePerShare: number;
  availableShares: number;
  yearlyReturn: number;
}

export default function InvestPage() {
  const [properties, setProperties] = useState<PropertyWithMetrics[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterMinROI, setFilterMinROI] = useState(0);
  const [filterArtistHouses, setFilterArtistHouses] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithMetrics | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Initialize Web3 provider safely
  useEffect(() => {
    const initializeWalletProvider = () => {
      try {
        if (typeof window === 'undefined') return;

        // Suppress wallet extension conflict errors
        const originalError = console.error;
        const errorFilter = (message: string) => {
          if (
            message.includes('Cannot redefine property') ||
            message.includes('Cannot set property ethereum') ||
            message.includes('listener indicated an asynchronous response')
          ) {
            return; // Suppress these errors
          }
          originalError(message);
        };
        console.error = errorFilter as any;

        // Check if window.ethereum exists and is usable
        const ethereum = (window as any).ethereum;
        if (ethereum && typeof ethereum.request === 'function') {
          // Validate provider is working with a simple request
          Promise.race([
            ethereum.request({ method: 'net_version' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 500))
          ]).then(
            () => {
              setWalletProvider(ethereum);
              setWalletError(null);
              console.error = originalError;
            },
            () => {
              // Provider not responding, disable Web3
              setWalletProvider(null);
              setWalletError(null); // Silent fallback
              console.error = originalError;
            }
          );
        } else {
          console.error = originalError;
        }
      } catch (error) {
        console.warn('Wallet provider initialization skipped:', error);
        setWalletProvider(null);
        setWalletError(null);
      }
    };

    initializeWalletProvider();
  }, []);

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetch('/api/homedao/properties');
        const data = await response.json();

        const propertiesWithMetrics: PropertyWithMetrics[] = data.map((prop: Property) => ({
          ...prop,
          roi: prop.annualYieldPercentage,
          pricePerShare: prop.valuationUsd / prop.maxShareSupply,
          availableShares: Math.floor(prop.maxShareSupply * 0.3),
          yearlyReturn: (prop.valuationUsd / prop.maxShareSupply) * prop.annualYieldPercentage,
        }));

        setProperties(propertiesWithMetrics);
        setFilteredProperties(propertiesWithMetrics);
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Filter properties
  useEffect(() => {
    let filtered = properties;

    if (filterCity) {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filterCity.toLowerCase()));
    }

    if (filterMinROI > 0) {
      filtered = filtered.filter(p => p.roi >= filterMinROI);
    }

    if (filterArtistHouses) {
      filtered = filtered.filter(p => p.isArtistHouse);
    }

    setFilteredProperties(filtered);
  }, [properties, filterCity, filterMinROI, filterArtistHouses]);

  const [shares, setShares] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const property = selectedProperty!;

  const proceedWithStripe = async () => {
    try {
      const response = await fetch('/api/homedao/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          shares,
          paymentMethod: 'stripe',
        }),
      });
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to create checkout session');
    }
  };

  function InvestmentModal({ property, walletProvider, onClose, onSuccess }: any) {
    const [shares, setShares] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = shares * property.pricePerShare;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Invest in {property.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Price per share:</span>
              <span className="font-semibold">${property.pricePerShare.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shares to purchase: {shares}
              </label>
              <input
                type="range"
                min="1"
                max={property.availableShares}
                value={shares}
                onChange={(e) => setShares(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${(totalPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#0891B2]">
                <span>Total:</span>
                <span>${(totalPrice * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition text-sm"
            >
              {isLoading ? 'Processing...' : 'Invest Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInvest = async () => {
    // Check if user is authenticated first
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (shares <= 0 || shares > property.availableShares) {
      toast.error('Please select a valid number of shares');
      return;
    }

    setIsLoading(true);
    try {
      let accountAddress = null;
      let paymentMethod = 'fiat'; // Default to fiat/Stripe

      // Check if wallet is available
      if (walletProvider) {
        try {
          const accounts = await Promise.race([
            walletProvider.request({ method: 'eth_requestAccounts' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Wallet timeout')), 3000))
          ]);
          accountAddress = accounts[0];
          paymentMethod = 'crypto';
        } catch (walletError: any) {
          const errorMsg = walletError?.message || String(walletError);

          // User rejected connection
          if (errorMsg.includes('User rejected')) {
            setIsLoading(false);
            toast.error('Wallet connection cancelled. Using Stripe payment instead.');
            return;
          }

          // Timeout or other error - offer help
          if (errorMsg.includes('timeout')) {
            setIsLoading(false);
            toast((t) => (
              <div className="space-y-2">
                <p className="font-bold">Wallet not responding</p>
                <p className="text-sm">No worries! We can process your investment via Stripe.</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      proceedWithStripe();
                    }}
                    className="px-3 py-1 bg-[#0891B2] text-white rounded text-sm font-bold"
                  >
                    Pay with Stripe
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ), { duration: 5000 });
            return;
          }
        }
      } else {
        // No wallet detected
        setIsLoading(false);
        toast((t) => (
          <div className="space-y-2 max-w-sm">
            <p className="font-bold">No crypto wallet detected</p>
            <p className="text-sm">You can still invest using Stripe. Or connect a Web3 wallet:</p>
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  proceedWithStripe();
                }}
                className="w-full px-3 py-2 bg-[#0891B2] text-white rounded text-sm font-bold hover:bg-cyan-600"
              >
                Continue with Stripe Payment
              </button>
              <a
                href={isMobileDevice() ? "https://www.privy.io/download" : "https://www.privy.io"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3 py-2 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white rounded text-sm font-bold text-center hover:shadow-lg"
              >
                {isMobileDevice() ? '📱 Open Privy Wallet' : '🔐 Connect with Privy'}
              </a>
            </div>
          </div>
        ), { duration: 6000 });
        return;
      }

      const response = await fetch('/api/homedao/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          shares,
          paymentMethod,
          accountAddress,
        }),
      });

      if (!response.ok) throw new Error('Investment failed');

      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Investment failed');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="Search city..."
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min ROI: {filterMinROI}%</label>
              <input
                type="range"
                min="0"
                max="20"
                value={filterMinROI}
                onChange={(e) => setFilterMinROI(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterArtistHouses}
                  onChange={(e) => setFilterArtistHouses(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-700">Artist Houses</span>
              </label>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition group cursor-pointer"
                onClick={() => setSelectedProperty(prop)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100 group-hover:opacity-90 transition">
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {prop.isArtistHouse && (
                    <div className="absolute top-3 left-3 bg-[#0891B2] text-white px-3 py-1 rounded-full text-xs font-bold">
                      Artist House
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{prop.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {prop.city}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 text-sm">
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-lg">
                      <div className="text-gray-600 text-xs mb-1">Valuation</div>
                      <div className="font-bold text-[#0891B2]">${(prop.valuationUsd / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-lg">
                      <div className="text-gray-600 text-xs mb-1">Annual Yield</div>
                      <div className="font-bold text-[#0891B2]">{prop.annualYieldPercentage}%</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProperty(prop)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-sm"
                  >
                    View & Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {showInvestModal && selectedProperty && (
        <InvestmentModal property={selectedProperty} walletProvider={walletProvider} onClose={() => setShowInvestModal(false)} onSuccess={handleInvest} />
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to invest</h2>
            <p className="text-gray-600 mb-6">
              Create an account or sign in to start investing in HouseDAO properties.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  router.push('/signup');
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  router.push('/login');
                }}
                className="w-full py-3 px-4 border-2 border-[#0891B2] text-[#0891B2] font-bold rounded-lg hover:bg-cyan-50 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full py-3 px-4 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
