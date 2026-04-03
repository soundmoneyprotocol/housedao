'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
  currentSharePrice: number;
  sharesAvailable: number;
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D946EF] to-pink-500 p-8 text-white">
        <div className="max-w-6xl mx-auto">
          <Link href="/invest" className="flex items-center gap-2 mb-4 w-fit hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            Back to All Properties
          </Link>
          <h1 className="text-4xl font-bold mb-2">Recently Listed Properties</h1>
          <p className="text-lg opacity-90">
            Discover the newest fractional real estate opportunities added to HouseDAO
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-neutral-400">
            {sortedProperties.length} properties available
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'newest'
                  ? 'bg-[#D946EF] text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('roi')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'roi'
                  ? 'bg-[#D946EF] text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Highest ROI
            </button>
            <button
              onClick={() => setSortBy('valuation')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'valuation'
                  ? 'bg-[#D946EF] text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Highest Valuation
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-neutral-400">Loading properties...</p>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400 mb-4">No properties found</p>
            <Link
              href="/list-property"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/50 transition"
            >
              Be the First to List
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-[#D946EF] transition group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {property.isArtistHouse && (
                    <div className="absolute top-4 right-4 bg-[#D946EF] text-white px-3 py-1 rounded-full text-sm font-bold">
                      Artist House
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name & City */}
                  <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
                  <div className="flex items-center gap-2 text-neutral-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.city}</span>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm">Valuation</span>
                      <span className="text-white font-bold">
                        {formatCurrency(property.valuationUsd)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        Annual ROI
                      </div>
                      <span className="text-green-400 font-bold">
                        {property.annualYieldPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <Users className="w-4 h-4" />
                        Shares Available
                      </div>
                      <span className="text-white font-bold">
                        {property.sharesAvailable}/{property.maxShareSupply}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/50 transition">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
