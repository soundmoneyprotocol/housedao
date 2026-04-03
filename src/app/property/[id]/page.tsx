'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Vote, Share2, History, AlertCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'dao' | 'dividends' | 'cap-table'>(
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
        setProposals(await proposalsRes.json());
      }

      if (dividendsRes.ok) {
        setDividends(await dividendsRes.json());
      }

      if (shareholdersRes.ok) {
        setShareholders(await shareholdersRes.json());
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
        <div className="text-white text-lg">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
        <div className="text-white text-lg">Property not found</div>
      </div>
    );
  }

  const roi = property.annualYieldPercentage / 100;
  const pricePerShare = (property.valuationUsd / 100) / property.maxShareSupply;
  const percentageSold = (property.sharesOutstanding / property.maxShareSupply) * 100;
  const availableShares = property.maxShareSupply - property.sharesOutstanding;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-neutral-800 to-neutral-950 overflow-hidden">
        {property.imageUrl && (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">{property.name}</h1>
              <p className="flex items-center gap-2 text-neutral-300 text-lg">
                <MapPin className="w-5 h-5" />
                {property.city}
              </p>
            </div>
            {property.isArtistHouse && (
              <div className="bg-[#FD7125] text-white px-4 py-2 rounded-full font-bold">
                Artist House
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-neutral-400 text-sm">Valuation</p>
              <p className="text-2xl font-bold text-white">
                ${(property.valuationUsd / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Annual ROI</p>
              <p className="text-2xl font-bold text-[#FD7125]">{roi.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Share Price</p>
              <p className="text-2xl font-bold text-white">${pricePerShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Shares Sold</p>
              <p className="text-2xl font-bold text-white">
                {percentageSold.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-500">{availableShares}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-neutral-800/50 border-b border-neutral-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 flex gap-8">
          {(['overview', 'dao', 'dividends', 'cap-table'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === tab
                  ? 'border-[#FD7125] text-[#FD7125]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'dao' && 'DAO Votes'}
              {tab === 'dividends' && 'Dividends'}
              {tab === 'cap-table' && 'Cap Table'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">About This Property</h2>
                <p className="text-neutral-300 leading-relaxed">{property.description}</p>
              </div>

              {/* Investment Progress */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Investment Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-300">Shares Sold</span>
                      <span className="text-white font-bold">
                        {property.sharesOutstanding} / {property.maxShareSupply}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FD7125] to-orange-400 h-full transition-all"
                        style={{ width: `${percentageSold}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-neutral-700/50 rounded-lg p-4">
                      <p className="text-neutral-400 text-sm">Total Invested</p>
                      <p className="text-lg font-bold text-white">
                        ${(pricePerShare * property.sharesOutstanding).toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-neutral-700/50 rounded-lg p-4">
                      <p className="text-neutral-400 text-sm">Avg Investors</p>
                      <p className="text-lg font-bold text-white">{shareholders.length}</p>
                    </div>
                    <div className="bg-neutral-700/50 rounded-lg p-4">
                      <p className="text-neutral-400 text-sm">Pending Dividends</p>
                      <p className="text-lg font-bold text-green-500">
                        Ξ {(property.accumulatedDividends / 1e18).toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-neutral-400 text-sm">Latitude</p>
                    <p className="text-white font-mono">{property.latitude}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Longitude</p>
                    <p className="text-white font-mono">{property.longitude}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Listed On</p>
                    <p className="text-white">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Action */}
              {availableShares > 0 && (
                <Link
                  href={`/homedao/invest?property=${propertyId}`}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FD7125]/50 transition text-center block"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Invest Now
                </Link>
              )}

              {/* Key Facts */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Key Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Min Investment</span>
                    <span className="text-white font-bold">${pricePerShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Max Supply</span>
                    <span className="text-white font-bold">{property.maxShareSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Available Now</span>
                    <span className="text-green-500 font-bold">{availableShares}</span>
                  </div>
                  <div className="border-t border-neutral-700 pt-3 mt-3 flex justify-between">
                    <span className="text-neutral-400">Annual Return/Share</span>
                    <span className="text-white font-bold">
                      ${(pricePerShare * roi).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-neutral-400">
                    Property listed on{' '}
                    <span className="text-white">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-neutral-400">
                    {shareholders.length} investors holding shares
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DAO Votes Tab */}
        {activeTab === 'dao' && (
          <div className="space-y-6">
            {proposals.length === 0 ? (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
                <Vote className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 mb-4">No active DAO proposals yet</p>
                <button className="py-2 px-6 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FD7125]/50">
                  + Create Proposal
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
          <div className="space-y-6">
            {dividends.length === 0 ? (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
                <TrendingUp className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">No dividend distributions yet</p>
              </div>
            ) : (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-white">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-white">
                          Total Distribution
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-white">
                          Per Share
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                      {dividends.map((dividend) => (
                        <tr key={dividend.id} className="hover:bg-neutral-700/50 transition">
                          <td className="px-6 py-4 text-white">
                            {new Date(dividend.distributedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-white font-bold">
                            Ξ {(dividend.totalAmount / 1e18).toFixed(4)}
                          </td>
                          <td className="px-6 py-4 text-green-500 font-bold">
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
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
            {shareholders.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">No shareholders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Investor</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Shares</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Ownership %
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Earnings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    {shareholders.map((shareholder) => (
                      <tr key={shareholder.address} className="hover:bg-neutral-700/50 transition">
                        <td className="px-6 py-4">
                          <code className="text-white font-mono text-sm">
                            {shareholder.address.slice(0, 6)}...{shareholder.address.slice(-4)}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-white font-bold">{shareholder.shares}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-neutral-700 rounded-full h-2">
                              <div
                                className="bg-[#FD7125] h-2 rounded-full"
                                style={{ width: `${shareholder.percentage}%` }}
                              />
                            </div>
                            <span className="text-white font-bold text-sm">
                              {shareholder.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-green-500 font-bold">
                          Ξ {(shareholder.earnings / 1e18).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{proposal.description}</h3>
            <span className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs font-bold">
              {proposalTypeLabel}
            </span>
          </div>
          <p className="text-neutral-400 text-sm">
            Deadline: {new Date(proposal.deadline).toLocaleDateString()}
            {isExpired && <span className="text-red-500 ml-2">(Expired)</span>}
          </p>
        </div>
        <div className="text-right">
          {proposal.executed && (
            <div className={`font-bold ${proposal.approved ? 'text-green-500' : 'text-red-500'}`}>
              {proposal.approved ? '✓ Approved' : '✗ Rejected'}
            </div>
          )}
        </div>
      </div>

      {/* Voting Results */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-green-500 font-bold">For: {proposal.forVotes}</span>
            <span className="text-neutral-400">{forPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${forPercentage}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-red-500 font-bold">Against: {proposal.againstVotes}</span>
            <span className="text-neutral-400">{(100 - forPercentage).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${100 - forPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {!proposal.executed && !isExpired && (
        <div className="mt-6 flex gap-3">
          <button className="flex-1 py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
            Vote For
          </button>
          <button className="flex-1 py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition">
            Vote Against
          </button>
        </div>
      )}
    </div>
  );
}
