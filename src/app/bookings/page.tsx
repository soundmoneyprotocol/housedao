'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  city: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  guestName: string;
  createdDate: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    // Mock data for demonstration
    const mockBookings: Booking[] = [
      {
        id: '1',
        propertyId: '1',
        propertyName: 'Miami Recording Studio',
        city: 'Miami',
        checkInDate: '2024-04-15',
        checkOutDate: '2024-04-18',
        nights: 3,
        totalPrice: 2850,
        status: 'upcoming',
        guestName: 'John Doe',
        createdDate: '2024-04-01',
      },
      {
        id: '2',
        propertyId: '2',
        propertyName: 'NYC Penthouse',
        city: 'New York',
        checkInDate: '2024-03-20',
        checkOutDate: '2024-03-23',
        nights: 3,
        totalPrice: 3600,
        status: 'completed',
        guestName: 'Jane Smith',
        createdDate: '2024-03-01',
      },
      {
        id: '3',
        propertyId: '3',
        propertyName: 'London Townhouse',
        city: 'London',
        checkInDate: '2024-05-01',
        checkOutDate: '2024-05-07',
        nights: 6,
        totalPrice: 5100,
        status: 'upcoming',
        guestName: 'Alex Johnson',
        createdDate: '2024-04-05',
      },
    ];
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Upcoming</span>;
      case 'completed':
        return <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Completed</span>;
      case 'cancelled':
        return <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-lg opacity-90">
              Manage your property reservations and booking history
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                      filterStatus === status
                        ? 'bg-[#0891B2] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No bookings found</p>
                  <Link
                    href="/invest"
                    className="inline-block mt-4 px-6 py-2 bg-[#0891B2] text-white font-semibold rounded-lg hover:bg-cyan-600"
                  >
                    Book a Property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                        {/* Property Info */}
                        <div className="md:col-span-2">
                          <Link
                            href={`/property/${booking.propertyId}`}
                            className="text-lg font-bold text-gray-900 hover:text-[#0891B2]"
                          >
                            {booking.propertyName}
                          </Link>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                            <MapPin className="w-4 h-4" />
                            {booking.city}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Guest: {booking.guestName}</p>
                        </div>

                        {/* Dates */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Dates</p>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(booking.checkInDate)}
                            </p>
                            <p className="text-xs text-gray-600">→ {formatDate(booking.checkOutDate)}</p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.nights} nights
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Total Price</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${booking.totalPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">${Math.round(booking.totalPrice / booking.nights)}/night</p>
                        </div>

                        {/* Status & Action */}
                        <div className="md:text-right">
                          <div className="mb-4">
                            {getStatusBadge(booking.status)}
                          </div>
                          <Link
                            href={`/property/${booking.propertyId}`}
                            className="inline-block px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
