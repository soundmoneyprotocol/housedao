'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, DollarSign, CheckCircle, Clock, Download, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  bookingType: 'hourly' | 'daily';
  startDate: string;
  startTime: string;
  duration: number;
  durationUnit: string;
  totalPrice: number;
  name: string;
  email: string;
  phone: string;
  bookingStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/homedao/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === 'all' || booking.bookingStatus === filterStatus;
    const matchesProperty = filterProperty === 'all' || booking.propertyId === filterProperty;
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);

    return matchesStatus && matchesProperty && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Booking ID', 'Property', 'Customer', 'Email', 'Phone', 'Date', 'Type', 'Duration', 'Amount', 'Status', 'Created'];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.propertyName,
      b.name,
      b.email,
      b.phone,
      b.startDate,
      b.bookingType,
      `${b.duration} ${b.durationUnit}`,
      `$${b.totalPrice}`,
      b.bookingStatus,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const uniqueProperties = new Set(bookings.map((b) => b.propertyId)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <p className="text-gray-800 text-lg">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D946EF] to-pink-400 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Booking Management</h1>
          <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">Internal CRM Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#D946EF] mt-1">${totalRevenue.toFixed(0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Properties</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{uniqueProperties}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Avg. Value</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              ${bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(0) : '0'}
            </p>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex sm:hidden items-center gap-2 w-full mb-4 px-3 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 ${!showFilters && 'hidden sm:grid'}`}>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D946EF] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D946EF] text-xs sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending_payment">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Property</label>
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D946EF] text-xs sm:text-sm"
              >
                <option value="all">All Properties</option>
                {Array.from(new Set(bookings.map((b) => b.propertyId))).map((propId) => (
                  <option key={propId} value={propId}>
                    {bookings.find((b) => b.propertyId === propId)?.propertyName.slice(0, 20)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>CSV
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600">
            Showing <span className="font-bold">{filteredBookings.length}</span> of{' '}
            <span className="font-bold">{bookings.length}</span>
          </p>
        </div>

        {/* Bookings List - Cards on mobile, Table on desktop */}
        <div className="space-y-4 sm:space-y-0">
          {filteredBookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
              <Calendar className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">No bookings found</p>
              <p className="text-gray-500 text-xs sm:text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{booking.name}</p>
                        <p className="text-xs text-gray-600">{booking.propertyName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-bold text-gray-900">{booking.duration} {booking.durationUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-bold text-[#D946EF]">${booking.totalPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-bold text-gray-900 capitalize">{booking.bookingType}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-1">
                      <a
                        href={`mailto:${booking.email}`}
                        className="flex items-center gap-2 text-[#D946EF] text-xs truncate"
                      >
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </a>
                      <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-[#D946EF] text-xs">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {booking.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Customer</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Property</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Date</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Duration</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Amount</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Status</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="font-bold text-gray-900 text-xs sm:text-sm">{booking.name}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">{booking.propertyName}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">
                            {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">
                            {booking.duration} {booking.durationUnit}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#D946EF] font-bold text-xs sm:text-sm">${booking.totalPrice}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-col gap-1">
                              <a
                                href={`mailto:${booking.email}`}
                                className="text-[#D946EF] hover:underline text-xs truncate"
                              >
                                {booking.email.split('@')[0]}
                              </a>
                              <a href={`tel:${booking.phone}`} className="text-[#D946EF] hover:underline text-xs">
                                {booking.phone}
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
