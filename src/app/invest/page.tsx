'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Vote, Share2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
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
  createdAt: string;
}

interface PropertyWithMetrics extends Property {
  roi: number;
  pricePerShare: number;
  availableShares: number;
  yearlyReturn: number;
}

export default function InvestPage() {
  // const user = useUserStore((state) => state.user);
  const [properties, setProperties] = useState<PropertyWithMetrics[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterMinROI, setFilterMinROI] = useState(0);
  const [filterArtistHouses, setFilterArtistHouses] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithMetrics | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/homedao/properties');
      if (response.ok) {
        const data: Property[] = await response.json();

        // Calculate metrics for each property
        const withMetrics = data.map((prop) => {
          const availableShares = prop.maxShareSupply - prop.sharesOutstanding;
          const pricePerShare = (prop.valuationUsd / 100) / prop.maxShareSupply; // Convert from cents
          const yearlyReturn = (prop.valuationUsd / 100) * (prop.annualYieldPercentage / 10000);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
        <div className="text-white text-lg">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FD7125] to-orange-500 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">HouseDAO: Invest in Real Estate</h1>
          <p className="text-lg opacity-90">
            Own fractional shares in premium properties and participate in DAO governance
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-neutral-800 border-b border-neutral-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="New York, LA, Miami..."
                value={filterCity}
                onChange={(e) =>
                  handleFilterChange(e.target.value, filterMinROI, filterArtistHouses)
                }
                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FD7125]"
              />
            </div>

            {/* ROI Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Min Annual ROI
              </label>
              <select
                value={filterMinROI}
                onChange={(e) =>
                  handleFilterChange(filterCity, parseFloat(e.target.value), filterArtistHouses)
                }
                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FD7125]"
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
                  className="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-[#FD7125] focus:ring-2 focus:ring-[#FD7125]"
                />
                <span className="text-sm font-medium text-neutral-300">Artist Houses Only</span>
              </label>
            </div>

            {/* List New Property Button */}
            <div className="flex items-end">
              <Link
                href="/homedao/list-property"
                className="w-full py-2 px-4 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FD7125]/50 transition text-center"
              >
                + List Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto p-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">No properties found matching your criteria</p>
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
      {showInvestModal && selectedProperty && (
        <InvestmentModal
          property={selectedProperty}
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
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-[#FD7125] transition">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-neutral-700 to-neutral-900 overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{property.name}</h3>
            <p className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              {property.city}
            </p>
          </div>
          {property.isArtistHouse && (
            <div className="bg-[#FD7125]/20 text-[#FD7125] px-3 py-1 rounded-full text-xs font-bold">
              Artist House
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Metrics Row 1 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* ROI */}
          <div className="bg-neutral-700/50 rounded-lg p-3">
            <p className="text-xs text-neutral-400">Annual ROI</p>
            <p className="text-xl font-bold text-[#FD7125]">{property.roi.toFixed(1)}%</p>
          </div>

          {/* Price per Share */}
          <div className="bg-neutral-700/50 rounded-lg p-3">
            <p className="text-xs text-neutral-400">Share Price</p>
            <p className="text-lg font-bold text-white">${property.pricePerShare.toFixed(2)}</p>
          </div>

          {/* Available Shares */}
          <div className="bg-neutral-700/50 rounded-lg p-3">
            <p className="text-xs text-neutral-400">Available</p>
            <p className="text-lg font-bold text-white">{property.availableShares}</p>
          </div>
        </div>

        {/* Metrics Row 2 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Yearly Return */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Yearly Return</p>
              <p className="text-sm font-bold text-white">
                ${property.yearlyReturn.toFixed(0)}/yr
              </p>
            </div>
          </div>

          {/* Total Valuation */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Valuation</p>
              <p className="text-sm font-bold text-white">
                ${(property.valuationUsd / 100).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-neutral-300">Shares Sold</p>
            <p className="text-xs text-neutral-400">
              {property.sharesOutstanding} / {property.maxShareSupply}
            </p>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FD7125] to-orange-400 h-full transition-all"
              style={{
                width: `${(property.sharesOutstanding / property.maxShareSupply) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onInvest}
            disabled={property.availableShares === 0}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FD7125]/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Invest
          </button>
          <Link
            href={`/homedao/property/${property.id}`}
            className="flex-1 py-2 px-4 bg-neutral-700 text-white font-bold rounded-lg hover:bg-neutral-600 transition text-center"
          >
            <Vote className="w-4 h-4 inline mr-2" />
            Vote
          </Link>
        </div>
      </div>
    </div>
  );
}

interface InvestmentModalProps {
  property: PropertyWithMetrics;
  onClose: () => void;
  onSuccess: () => void;
}

function InvestmentModal({ property, onClose, onSuccess }: InvestmentModalProps) {
  const [shares, setShares] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalCost = shares * property.pricePerShare;
  const projectedAnnualReturn = totalCost * (property.roi / 100);

  const handleInvest = async () => {
    if (shares <= 0 || shares > property.availableShares) {
      toast.error('Invalid share amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/homedao/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.blockchainId,
          sharesDesired: shares,
          totalUSD: totalCost * 100, // Convert to cents
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Investment failed');
      }
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('Failed to process investment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Invest in {property.name}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-neutral-400">Price per Share:</span>
            <span className="text-white font-bold">${property.pricePerShare.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Available Shares:</span>
            <span className="text-white font-bold">{property.availableShares}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Annual ROI:</span>
            <span className="text-[#FD7125] font-bold">{property.roi.toFixed(1)}%</span>
          </div>
        </div>

        {/* Share Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Number of Shares
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setShares(Math.max(1, shares - 1))}
              className="px-3 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
            >
              −
            </button>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.min(property.availableShares, parseInt(e.target.value) || 0))}
              className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#FD7125]"
            />
            <button
              onClick={() => setShares(Math.min(property.availableShares, shares + 1))}
              className="px-3 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-neutral-700/50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-400">Total Investment:</span>
            <span className="text-white font-bold">${totalCost.toFixed(2)}</span>
          </div>
          <div className="border-t border-neutral-600 pt-3 flex justify-between">
            <span className="text-neutral-300">Projected Annual Return:</span>
            <span className="text-green-500 font-bold">${projectedAnnualReturn.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-neutral-700 text-white font-bold rounded-lg hover:bg-neutral-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInvest}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-[#FD7125] to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FD7125]/50 disabled:opacity-50 transition"
          >
            {isLoading ? 'Processing...' : 'Invest Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
