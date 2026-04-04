'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Vote, Share2, Calendar, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Header from '../../components/Header';

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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/homedao/properties');
      if (response.ok) {
        const data = await response.json();

        const withMetrics = data.properties.map((prop: Property) => {
          const sharesOutstanding = prop.sharesOutstanding || 0;
          const availableShares = prop.maxShareSupply - sharesOutstanding;
          const pricePerShare = prop.valuationUsd > 0 ? (prop.valuationUsd / 100) / prop.maxShareSupply : 0;
          const yearlyReturn = prop.valuationUsd > 0 ? (prop.valuationUsd / 100) * (prop.annualYieldPercentage / 10000) : 0;
          const roi = prop.annualYieldPercentage / 100;

          return {
            ...prop,
            roi,
            pricePerShare,
            availableShares,
            yearlyReturn,
          };
        });

        setProperties(withMetrics);
        applyFilters(withMetrics, filterCity, filterMinROI, filterArtistHouses);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    props: PropertyWithMetrics[],
    city: string,
    roi: number,
    artistHousesOnly: boolean
  ) => {
    let filtered = props;

    if (city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (roi > 0) {
      filtered = filtered.filter((p) => p.roi >= roi);
    }

    if (artistHousesOnly) {
      filtered = filtered.filter((p) => p.isArtistHouse);
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (city: string, roi: number, artistHouses: boolean) => {
    setFilterCity(city);
    setFilterMinROI(roi);
    setFilterArtistHouses(artistHouses);
    applyFilters(properties, city, roi, artistHouses);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-sm sm:text-base md:text-lg">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header />

      {/* Wallet Error Banner */}
      {walletError && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3">
          <p className="text-sm">{walletError}</p>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="New York, LA, Miami..."
                value={filterCity}
                onChange={(e) =>
                  handleFilterChange(e.target.value, filterMinROI, filterArtistHouses)
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              />
            </div>

            {/* ROI Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Annual ROI
              </label>
              <select
                value={filterMinROI}
                onChange={(e) =>
                  handleFilterChange(filterCity, parseFloat(e.target.value), filterArtistHouses)
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              >
                <option value="0">All ROIs</option>
                <option value="3">3%+</option>
                <option value="5">5%+</option>
                <option value="7">7%+</option>
                <option value="10">10%+</option>
              </select>
            </div>

            {/* Artist Houses Filter */}
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={filterArtistHouses}
                  onChange={(e) =>
                    handleFilterChange(filterCity, filterMinROI, e.target.checked)
                  }
                  className="w-5 h-5 rounded bg-gray-100 border-gray-300 text-[#0891B2] focus:ring-2 focus:ring-[#0891B2]"
                />
                <span className="text-sm font-medium text-gray-700">Artist Houses Only</span>
              </label>
            </div>

            {/* List New Property Button */}
            <div className="flex items-end">
              <Link
                href="/list-property"
                className="w-full py-2 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-center text-sm"
              >
                + List Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">No properties found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onInvest={() => {
                  setSelectedProperty(property);
                  setShowInvestModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {showInvestModal && selectedProperty && selectedProperty.valuationUsd > 0 && (
        <InvestmentModal
          property={selectedProperty}
          walletProvider={walletProvider}
          onClose={() => setShowInvestModal(false)}
          onSuccess={() => {
            setShowInvestModal(false);
            fetchProperties();
            toast.success('Investment successful!');
          }}
        />
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: PropertyWithMetrics;
  onInvest: () => void;
}

function PropertyCard({ property, onInvest }: PropertyCardProps) {
  const sharesSoldPercent = ((property.sharesOutstanding || 0) / property.maxShareSupply) * 100;
  const isPopular = sharesSoldPercent > 70;
  const isTrending = (property.createdAt && new Date(property.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Zap className="w-12 h-12" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {property.isArtistHouse && (
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              Artist House
            </div>
          )}
          {isPopular && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Popular
            </div>
          )}
          {isTrending && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>

        {/* Location Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Title & Description */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Key Metrics Grid */}
        {property.valuationUsd > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Share Price</p>
                <p className="text-lg font-bold text-gray-900">${property.pricePerShare.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Annual ROI</p>
                <p className="text-lg font-bold text-green-600">{property.roi.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Valuation</p>
                <p className="text-lg font-bold text-gray-900">${(property.valuationUsd / 1000000).toFixed(1)}M</p>
              </div>
            </div>

            {/* Shares Sold Progress */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Shares Sold</p>
                <p className="text-xs font-bold text-gray-600">
                  {sharesSoldPercent.toFixed(0)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0891B2] to-cyan-400 h-full transition-all duration-500"
                  style={{
                    width: `${sharesSoldPercent}%`,
                  }}
                />
              </div>
            </div>

            {/* Yearly Return */}
            <div className="mb-5 p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-gray-600">Projected Yearly Return</p>
              <p className="text-lg font-bold text-green-700">${property.yearlyReturn.toFixed(0)}/yr</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onInvest}
                disabled={property.availableShares === 0}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#0891B2]/30 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Invest
              </button>
              <Link
                href={`/book-studio/${property.id}`}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition text-center text-sm"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Book
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Hourly</p>
                <p className="text-lg font-bold text-gray-900">${property.hourlyRate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Daily</p>
                <p className="text-lg font-bold text-gray-900">${property.dailyRate}</p>
              </div>
            </div>

            <Link
              href={`/book-studio/${property.id}`}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-center text-sm"
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Book Now
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

interface InvestmentModalProps {
  property: PropertyWithMetrics;
  walletProvider: any;
  onClose: () => void;
  onSuccess: () => void;
}

function InvestmentModal({ property, walletProvider, onClose, onSuccess }: InvestmentModalProps) {
  const [shares, setShares] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalCost = shares * property.pricePerShare;
  const projectedAnnualReturn = totalCost * (property.roi / 100);

  const handleInvest = async () => {
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
            <p className="text-sm">You can still invest using Stripe. Or install a Web3 wallet:</p>
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
                href="https://www.privy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3 py-2 bg-gray-600 text-white rounded text-sm font-bold text-center hover:bg-gray-700"
              >
                Connect with Privy
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
          propertyId: property.blockchainId,
          sharesDesired: shares,
          totalUSD: totalCost * 100,
          walletAddress: accountAddress,
          paymentMethod,
        }),
      });

      if (response.ok) {
        toast.success(`Investment confirmed via ${paymentMethod === 'crypto' ? 'blockchain' : 'Stripe'}!`);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Investment processing failed');
      }
    } catch (error) {
      console.error('Investment error:', error);
      const errorMsg = String(error);

      if (errorMsg.includes('insufficient')) {
        toast.error('Insufficient funds. Please add more crypto to your wallet.');
      } else if (errorMsg.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to process investment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proceedWithStripe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/homedao/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.blockchainId,
          sharesDesired: shares,
          totalUSD: totalCost * 100,
          paymentMethod: 'fiat',
        }),
      });

      if (response.ok) {
        toast.success('Proceeding to Stripe payment...');
        onSuccess();
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error('Could not process Stripe payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Invest in {property.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Price per Share:</span>
            <span className="text-gray-900 font-bold">${property.pricePerShare.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Available Shares:</span>
            <span className="text-gray-900 font-bold">{property.availableShares}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Annual ROI:</span>
            <span className="text-green-600 font-bold">{property.roi.toFixed(1)}%</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Shares
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setShares(Math.max(1, shares - 1))}
              className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
            >
              −
            </button>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.min(property.availableShares, parseInt(e.target.value) || 0))}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
            />
            <button
              onClick={() => setShares(Math.min(property.availableShares, shares + 1))}
              className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Investment:</span>
            <span className="text-gray-900 font-bold">${totalCost.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between">
            <span className="text-gray-700">Projected Annual Return:</span>
            <span className="text-green-600 font-bold">${projectedAnnualReturn.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-bold">Payment methods:</span></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Crypto wallet (MetaMask, WalletConnect, etc.)</li>
              <li>Stripe (card payment)</li>
            </ul>
            <p className="mt-2 italic">No wallet? No problem - Stripe payment is always available.</p>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleInvest}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition text-sm"
            >
              {isLoading ? 'Processing...' : 'Invest Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
