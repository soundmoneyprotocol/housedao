'use client';

import React, { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ListPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: '',
    description: '',
    imageUrl: '',
    valuationUsd: '',
    annualYieldPercentage: '',
    maxShareSupply: '',
    isArtistHouse: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.valuationUsd) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/homedao/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          valuationUsd: parseFloat(formData.valuationUsd),
          annualYieldPercentage: parseFloat(formData.annualYieldPercentage || '0'),
          maxShareSupply: parseInt(formData.maxShareSupply || '1000'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Property listed successfully!');
        // Redirect to recently-listed page for sharing
        setTimeout(() => {
          router.push('/recently-listed');
        }, 500);
      } else {
        toast.error('Failed to list property');
      }
    } catch (error) {
      console.error('Error listing property:', error);
      toast.error('Error listing property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/invest" className="flex items-center gap-2 mb-4 w-fit hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </Link>
          <h1 className="text-4xl font-bold mb-2">List Your Property</h1>
          <p className="text-lg opacity-90">
            Join HouseDAO and earn passive income from your real estate
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Brooklyn Loft"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., New York"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="40.6501"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-73.9496"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                disabled={isSubmitting}
              />
            </div>

            {/* Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valuation (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="valuationUsd"
                  value={formData.valuationUsd}
                  onChange={handleChange}
                  placeholder="5000000"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual ROI (%)
                </label>
                <input
                  type="number"
                  name="annualYieldPercentage"
                  value={formData.annualYieldPercentage}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Shares
                </label>
                <input
                  type="number"
                  name="maxShareSupply"
                  value={formData.maxShareSupply}
                  onChange={handleChange}
                  placeholder="1000"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Image & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isArtistHouse"
                    checked={formData.isArtistHouse}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-neutral-700 border-gray-300 text-[#0891B2]"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium text-gray-700">Artist House Venue</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#0891B2]/30 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {isSubmitting ? 'Listing...' : 'List Property'}
              </button>

              <Link
                href="/invest"
                className="py-3 px-6 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-neutral-600 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
