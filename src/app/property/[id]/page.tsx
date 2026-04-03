'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Vote, Share2, History, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Property {
  id: string;
  blockchainId: number;
  name: string;
  city: string;
  latitude: string;
  longitude: string;
  description: string;
  imageUrl: string;
  valuationUsd: number;
  annualYieldPercentage: number;
  sharesOutstanding: number;
  maxShareSupply: number;
  isArtistHouse: boolean;
  accumulatedDividends: number;
  createdAt: string;
  hourlyRate?: number;
  dailyRate?: number;
}

interface DAOProposal {
  id: string;
  blockchainId: number;
  description: string;
  proposalType: number;
  forVotes: number;
  againstVotes: number;
  deadline: string;
  executed: boolean;
  approved: boolean;
}

interface DividendRecord {
  id: string;
  totalAmount: number;
  amountPerShare: number;
  distributedAt: string;
}

interface Shareholder {
  address: string;
  shares: number;
  percentage: number;
  earnings: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [proposals, setProposals] = useState<DAOProposal[]>([]);
  const [dividends, setDividends] = useState<DividendRecord[]>([]);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'dao' | 'dividends' | 'cap-table' | 'booking'>(
    'overview'
  );

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      const [propRes, proposalsRes, dividendsRes, shareholdersRes] = await Promise.all([
        fetch(`/api/homedao/properties/${propertyId}`),
        fetch(`/api/homedao/properties/${propertyId}/proposals`),
        fetch(`/api/homedao/properties/${propertyId}/dividends`),
        fetch(`/api/homedao/properties/${propertyId}/shareholders`),
      ]);

      if (propRes.ok) {
        setProperty(await propRes.json());
      }

      if (proposalsRes.ok) {
        const data = await proposalsRes.json();
        setProposals(data.proposals || []);
      }

      if (dividendsRes.ok) {
        const data = await dividendsRes.json();
        setDividends(data.dividends || []);
      }

      if (shareholdersRes.ok) {
        const data = await shareholdersRes.json();
        setShareholders(data.shareholders || []);
      }
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="text-gray-800 text-lg">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="text-gray-800 text-lg">Property not found</div>
      </div>
    );
  }

  const roi = property.annualYieldPercentage / 100;
  const pricePerShare = (property.valuationUsd / 100) / property.maxShareSupply;
  const percentageSold = (property.sharesOutstanding / property.maxShareSupply) * 100;
  const availableShares = property.maxShareSupply - property.sharesOutstanding;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-56 sm:h-96 bg-gradient-to-r from-[#D946EF] to-pink-400 overflow-hidden">
        {property.imageUrl && (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D946EF]/80 to-pink-400/80" />

        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 break-words">{property.name}</h1>
              <p className="flex items-center gap-2 text-white text-sm sm:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">{property.city}</span>
              </p>
            </div>
            {property.isArtistHouse && (
              <div className="bg-white text-[#D946EF] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                Artist House
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6 min-w-max sm:min-w-0">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Valuation</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${(property.valuationUsd / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Annual ROI</p>
              <p className="text-xl sm:text-2xl font-bold text-[#D946EF]">{roi.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Share Price</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">${pricePerShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Shares Sold</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {percentageSold.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{availableShares}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex gap-2 sm:gap-8 overflow-x-auto">
          {(['overview', 'dao', 'dividends', 'cap-table', 'booking'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 sm:py-4 px-2 sm:px-0 border-b-2 font-medium transition whitespace-nowrap text-xs sm:text-base ${
                activeTab === tab
                  ? 'border-[#D946EF] text-[#D946EF]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'dao' && 'DAO'}
              {tab === 'dividends' && 'Dividends'}
              {tab === 'cap-table' && 'Cap Table'}
              {tab === 'booking' && 'Booking'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Description & Info */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{property.description}</p>
              </div>

              {/* Investment Progress */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Investment Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                      <span className="text-gray-700">Shares Sold</span>
                      <span className="text-gray-900 font-bold">
                        {property.sharesOutstanding} / {property.maxShareSupply}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#D946EF] to-pink-400 h-full transition-all"
                        style={{ width: `${percentageSold}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <p className="text-gray-600 text-xs sm:text-sm">Invested</p>
                      <p className="text-lg sm:text-lg font-bold text-gray-900 mt-1">
                        ${(pricePerShare * property.sharesOutstanding).toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <p className="text-gray-600 text-xs sm:text-sm">Investors</p>
                      <p className="text-lg sm:text-lg font-bold text-gray-900 mt-1">{shareholders.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <p className="text-gray-600 text-xs sm:text-sm">Dividends</p>
                      <p className="text-lg sm:text-lg font-bold text-green-600 mt-1">
                        Ξ {(property.accumulatedDividends / 1e18).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Latitude</p>
                    <p className="text-gray-900 font-mono text-xs sm:text-sm">{property.latitude}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Longitude</p>
                    <p className="text-gray-900 font-mono text-xs sm:text-sm">{property.longitude}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Listed On</p>
                    <p className="text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Action */}
              {availableShares > 0 && (
                <Link
                  href={`/property/${propertyId}?tab=overview`}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/30 transition text-center block text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Invest Now
                </Link>
              )}

              {/* Key Facts */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Key Facts</h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs sm:text-sm">Min Investment</span>
                    <span className="text-gray-900 font-bold text-sm sm:text-base">${pricePerShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs sm:text-sm">Max Supply</span>
                    <span className="text-gray-900 font-bold text-sm sm:text-base">{property.maxShareSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs sm:text-sm">Available</span>
                    <span className="text-green-600 font-bold text-sm sm:text-base">{availableShares}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 sm:pt-3 mt-2 sm:mt-3 flex justify-between">
                    <span className="text-gray-600 text-xs sm:text-sm">Annual/Share</span>
                    <span className="text-gray-900 font-bold text-sm sm:text-base">
                      ${(pricePerShare * roi).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 sm:w-5 sm:h-5" />
                  Activity
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <p className="text-gray-600">
                    Listed{' '}
                    <span className="text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    {shareholders.length} investors
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DAO Votes Tab */}
        {activeTab === 'dao' && (
          <div className="space-y-4 sm:space-y-6">
            {proposals.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
                <Vote className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No proposals yet</p>
                <button className="py-2 px-4 sm:py-2 sm:px-6 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg text-xs sm:text-sm">
                  + Create
                </button>
              </div>
            ) : (
              proposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            )}
          </div>
        )}

        {/* Dividends Tab */}
        {activeTab === 'dividends' && (
          <div className="space-y-4 sm:space-y-6">
            {dividends.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
                <TrendingUp className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-base">No distributions yet</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3 p-4">
                  {dividends.map((dividend) => (
                    <div key={dividend.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Date</span>
                        <span className="font-bold text-sm text-gray-900">
                          {new Date(dividend.distributedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total</span>
                        <span className="font-bold text-sm text-gray-900">
                          Ξ {(dividend.totalAmount / 1e18).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Per Share</span>
                        <span className="font-bold text-sm text-green-600">
                          Ξ {(dividend.amountPerShare / 1e18).toFixed(6)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Date</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Total</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Per Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dividends.map((dividend) => (
                        <tr key={dividend.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">
                            {new Date(dividend.distributedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-bold text-xs sm:text-sm">
                            Ξ {(dividend.totalAmount / 1e18).toFixed(4)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-green-600 font-bold text-xs sm:text-sm">
                            Ξ {(dividend.amountPerShare / 1e18).toFixed(6)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cap Table Tab */}
        {activeTab === 'cap-table' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {shareholders.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Users className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-base">No shareholders yet</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3 p-4">
                  {shareholders.map((shareholder) => (
                    <div key={shareholder.address} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-600">Investor</p>
                        <p className="font-mono text-xs text-gray-900 break-all">
                          {shareholder.address.slice(0, 6)}...{shareholder.address.slice(-4)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Shares</span>
                        <span className="font-bold text-sm text-gray-900">{shareholder.shares}</span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">Ownership</span>
                          <span className="font-bold text-xs text-gray-900">{shareholder.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#D946EF] h-1.5 rounded-full"
                            style={{ width: `${shareholder.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Earnings</span>
                        <span className="font-bold text-sm text-green-600">
                          Ξ {(shareholder.earnings / 1e18).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Investor</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Shares</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Ownership %</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shareholders.map((shareholder) => (
                        <tr key={shareholder.address} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                            <code className="text-gray-900 font-mono">
                              {shareholder.address.slice(0, 6)}...{shareholder.address.slice(-4)}
                            </code>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-bold text-xs sm:text-sm">{shareholder.shares}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#D946EF] h-2 rounded-full"
                                  style={{ width: `${shareholder.percentage}%` }}
                                />
                              </div>
                              <span className="text-gray-900 font-bold text-xs sm:text-sm">
                                {shareholder.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-green-600 font-bold text-xs sm:text-sm">
                            Ξ {(shareholder.earnings / 1e18).toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#D946EF] flex-shrink-0" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Book This Property</h2>
              </div>

              {/* Booking Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                {/* Hourly Rate */}
                <div className="bg-gradient-to-br from-[#D946EF]/10 to-pink-100 border border-[#D946EF]/30 rounded-lg p-4 sm:p-6">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Hourly</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                    ${property.hourlyRate?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">By the hour</p>
                  <Link
                    href={`/book-studio/${propertyId}`}
                    className="inline-block py-2 px-4 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg transition text-xs sm:text-sm"
                  >
                    Book Now
                  </Link>
                </div>

                {/* Daily Rate */}
                <div className="bg-gradient-to-br from-[#D946EF]/10 to-pink-100 border border-[#D946EF]/30 rounded-lg p-4 sm:p-6">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Daily</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                    ${property.dailyRate?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">Full day</p>
                  <Link
                    href={`/book-studio/${propertyId}`}
                    className="inline-block py-2 px-4 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg transition text-xs sm:text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Info</h3>
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D946EF] font-bold flex-shrink-0">•</span>
                    <span>Click "Book Now" to reserve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D946EF] font-bold flex-shrink-0">•</span>
                    <span>Choose hourly or daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D946EF] font-bold flex-shrink-0">•</span>
                    <span>Confirm dates and times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D946EF] font-bold flex-shrink-0">•</span>
                    <span>Complete payment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProposalCardProps {
  proposal: DAOProposal;
}

function ProposalCard({ proposal }: ProposalCardProps) {
  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPercentage = totalVotes === 0 ? 0 : (proposal.forVotes / totalVotes) * 100;

  const proposalTypeLabel = ['Maintenance', 'Refinance', 'Management', 'Other'][proposal.proposalType] ||
    'Other';
  const isExpired = new Date(proposal.deadline) < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{proposal.description}</h3>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
              {proposalTypeLabel}
            </span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Deadline: {new Date(proposal.deadline).toLocaleDateString()}
            {isExpired && <span className="text-red-600 ml-2">(Expired)</span>}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          {proposal.executed && (
            <div className={`font-bold text-xs sm:text-sm ${proposal.approved ? 'text-green-600' : 'text-red-600'}`}>
              {proposal.approved ? '✓ Approved' : '✗ Rejected'}
            </div>
          )}
        </div>
      </div>

      {/* Voting Results */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1 text-xs sm:text-sm">
            <span className="text-green-600 font-bold">For: {proposal.forVotes}</span>
            <span className="text-gray-600">{forPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-green-600 h-full" style={{ width: `${forPercentage}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1 text-xs sm:text-sm">
            <span className="text-red-600 font-bold">Against: {proposal.againstVotes}</span>
            <span className="text-gray-600">{(100 - forPercentage).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-red-600 h-full"
              style={{ width: `${100 - forPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {!proposal.executed && !isExpired && (
        <div className="mt-4 flex gap-2">
          <button className="flex-1 py-2 px-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-xs sm:text-sm">
            For
          </button>
          <button className="flex-1 py-2 px-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-xs sm:text-sm">
            Against
          </button>
        </div>
      )}
    </div>
  );
}
