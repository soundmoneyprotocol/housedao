'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '../../components/Header';

interface Property {
  id: string;
  name: string;
  city: string;
  description: string;
  imageUrl: string;
  valuationUsd: number;
  annualYieldPercentage: number;
  maxShareSupply: number;
  isArtistHouse: boolean;
  sharesOutstanding?: number;
  createdAt?: string;
}

export default function RecentlyListedPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'roi' | 'valuation'>('newest');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/homedao/properties');
      if (response.ok) {
        const data = await response.json();
        // Sort by newest (reverse order)
        setProperties(data.properties.reverse());
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const getSortedProperties = () => {
    const props = [...properties];
    switch (sortBy) {
      case 'roi':
        return props.sort((a, b) => b.annualYieldPercentage - a.annualYieldPercentage);
      case 'valuation':
        return props.sort((a, b) => b.valuationUsd - a.valuationUsd);
      case 'newest':
      default:
        return props;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const sortedProperties = getSortedProperties();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Recently Listed Properties</h1>
            <p className="text-lg opacity-90">
              Discover the newest fractional real estate opportunities added to HouseDAO
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <p className="text-gray-600 font-medium">
              {sortedProperties.length} properties available
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  sortBy === 'newest'
                    ? 'bg-[#0891B2] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('roi')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  sortBy === 'roi'
                    ? 'bg-[#0891B2] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Highest ROI
              </button>
              <button
                onClick={() => setSortBy('valuation')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  sortBy === 'valuation'
                    ? 'bg-[#0891B2] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Highest Valuation
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No properties found</p>
              <Link
                href="/list-property"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Be the First to List
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <RecentPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface RecentPropertyCardProps {
  property: Property;
}

function RecentPropertyCard({ property }: RecentPropertyCardProps) {
  const isTrending = (property.createdAt && new Date(property.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Link
      href={`/property/${property.id}`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
          {isTrending && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              New
            </div>
          )}
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Name & Description */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Metrics */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Valuation</span>
            <span className="text-gray-900 font-bold">
              {formatCurrency(property.valuationUsd)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Annual ROI
            </div>
            <span className="text-green-600 font-bold">
              {property.annualYieldPercentage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
              <Users className="w-4 h-4" />
              Shares Available
            </div>
            <span className="text-gray-900 font-bold">
              {property.maxShareSupply - (property.sharesOutstanding || 0)}/{property.maxShareSupply}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition text-sm">
          View Details
        </button>
      </div>
    </Link>
  );
}
