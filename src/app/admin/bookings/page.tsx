'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, DollarSign, CheckCircle, Clock, Download, Filter, X, MessageCircle, Share2, Star, Send, MapPin } from 'lucide-react';
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
  checkInCode?: string;
  checkInStatus?: 'pending' | 'checked_in' | 'checked_out';
}

interface Review {
  id: string;
  platform: 'google' | 'yelp' | 'twitter' | 'instagram' | 'facebook';
  propertyName: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  verified: boolean;
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
}

interface WhatsAppMessage {
  id: string;
  customerName: string;
  customerPhone: string;
  propertyName: string;
  message: string;
  sender: 'customer' | 'business';
  timestamp: string;
  read: boolean;
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews' | 'social' | 'whatsapp' | 'checkins'>('bookings');

  // Social post state
  const [socialPostContent, setSocialPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  // Mock data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      platform: 'google',
      propertyName: 'Miami Recording Studio',
      author: 'Alex Johnson',
      rating: 5,
      content: 'Exceptional studio with professional equipment. Perfect for our album recording!',
      createdAt: '2026-03-28',
      verified: true,
    },
    {
      id: '2',
      platform: 'yelp',
      propertyName: 'Artist House LA',
      author: 'Maria Garcia',
      rating: 4,
      content: 'Great space and friendly staff. Would book again for creative sessions.',
      createdAt: '2026-03-25',
      verified: true,
    },
    {
      id: '3',
      platform: 'instagram',
      propertyName: 'Billionaires Row NYC',
      author: '@musicproducer_elite',
      rating: 5,
      content: 'This penthouse studio is unreal! Perfect for mixing sessions',
      createdAt: '2026-03-22',
      verified: false,
    },
  ]);

  const [whatsAppMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      customerName: 'John Smith',
      customerPhone: '+1-555-123-4567',
      propertyName: 'Miami Recording Studio',
      message: 'Hi, I have a booking on April 5th. Can I arrive 15 minutes early?',
      sender: 'customer',
      timestamp: '2026-04-03T10:30:00',
      read: true,
    },
    {
      id: '2',
      customerName: 'John Smith',
      customerPhone: '+1-555-123-4567',
      propertyName: 'Miami Recording Studio',
      message: 'Of course! We can have the studio ready by 2:45 PM. See you then!',
      sender: 'business',
      timestamp: '2026-04-03T10:32:00',
      read: true,
    },
  ]);

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
        const bookingsWithCheckIn = (data.bookings || []).map((b: Booking) => ({
          ...b,
          checkInCode: `HCD-${b.id.slice(0, 6).toUpperCase()}`,
          checkInStatus: 'pending' as const,
        }));
        setBookings(bookingsWithCheckIn);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSocialPost = () => {
    if (!socialPostContent.trim() || selectedPlatforms.length === 0) {
      toast.error('Please add content and select platforms');
      return;
    }

    const newPost: SocialPost = {
      id: Math.random().toString(36).substr(2, 9),
      content: socialPostContent,
      platforms: selectedPlatforms,
      scheduledFor: new Date().toISOString(),
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    setSocialPosts([newPost, ...socialPosts]);
    setSocialPostContent('');
    setSelectedPlatforms([]);
    toast.success(`Posted to ${selectedPlatforms.join(', ')}`);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
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

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      google: 'bg-blue-100 text-blue-800',
      yelp: 'bg-red-100 text-red-800',
      twitter: 'bg-sky-100 text-sky-800',
      instagram: 'bg-pink-100 text-pink-800',
      facebook: 'bg-indigo-100 text-indigo-800',
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const uniqueProperties = new Set(bookings.map((b) => b.propertyId)).size;
  const unreadMessages = whatsAppMessages.filter((m) => !m.read && m.sender === 'customer').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <p className="text-gray-800 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D946EF] to-pink-400 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Management Dashboard</h1>
          <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">Bookings, Reviews, Social & Customer Service</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#D946EF] mt-1">${totalRevenue.toFixed(0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Avg Reviews</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">4.7/5</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm">Messages</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{unreadMessages}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto mb-6 sm:mb-8">
          <div className="flex gap-2 p-1 sm:p-2 min-w-max sm:min-w-0">
            {(['bookings', 'reviews', 'social', 'whatsapp', 'checkins'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#D946EF] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'bookings' && 'Bookings'}
                {tab === 'reviews' && 'Reviews'}
                {tab === 'social' && 'Social'}
                {tab === 'whatsapp' && `Messages ${unreadMessages > 0 ? `(${unreadMessages})` : ''}`}
                {tab === 'checkins' && 'Check-ins'}
              </button>
            ))}
          </div>
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <>
            {/* Filters & Export */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex sm:hidden items-center gap-2 w-full mb-4 px-3 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              <div className={`grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 ${!showFilters && 'hidden sm:grid'}`}>
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

            {/* Bookings List */}
            <div className="space-y-4 sm:space-y-0">
              {filteredBookings.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
                  <Calendar className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">No bookings found</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{booking.name}</p>
                            <p className="text-xs text-gray-600">{booking.propertyName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount</p>
                            <p className="font-bold text-[#D946EF]">${booking.totalPrice}</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <a href={`mailto:${booking.email}`} className="text-[#D946EF] text-xs block truncate">
                            {booking.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left font-bold text-gray-900 text-xs">Customer</th>
                            <th className="px-6 py-3 text-left font-bold text-gray-900 text-xs">Property</th>
                            <th className="px-6 py-3 text-left font-bold text-gray-900 text-xs">Date</th>
                            <th className="px-6 py-3 text-left font-bold text-gray-900 text-xs">Amount</th>
                            <th className="px-6 py-3 text-left font-bold text-gray-900 text-xs">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3 font-bold text-gray-900">{booking.name}</td>
                              <td className="px-6 py-3 text-gray-900">{booking.propertyName}</td>
                              <td className="px-6 py-3 text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</td>
                              <td className="px-6 py-3 text-[#D946EF] font-bold">${booking.totalPrice}</td>
                              <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(booking.bookingStatus)}`}>
                                  {booking.bookingStatus.replace('_', ' ')}
                                </span>
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
          </>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPlatformColor(review.platform)}`}>
                          {review.platform.charAt(0).toUpperCase() + review.platform.slice(1)}
                        </span>
                        {review.verified && <span className="text-green-600 text-xs font-bold">Verified</span>}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{review.author}</p>
                      <p className="text-gray-600 text-xs">{review.propertyName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Compose Post */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create Social Post</h3>

              <div className="mb-4">
                <textarea
                  value={socialPostContent}
                  onChange={(e) => setSocialPostContent(e.target.value)}
                  placeholder="Share updates about your properties, events, or community..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D946EF] text-sm resize-none"
                  rows={4}
                />
              </div>

              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700 mb-3">Platforms</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['google', 'yelp', 'twitter', 'instagram', 'facebook'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                        selectedPlatforms.includes(platform)
                          ? `${getPlatformColor(platform)} ring-2 ring-[#D946EF]`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePublishSocialPost}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#D946EF] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Publish to {selectedPlatforms.length > 0 ? selectedPlatforms.length : 'Platforms'}
              </button>
            </div>

            {/* Published Posts */}
            {socialPosts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-3">
                  {socialPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-900 text-sm mb-3">{post.content}</p>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {post.platforms.map((p) => (
                          <span key={p} className={`px-2 py-1 rounded text-xs font-bold ${getPlatformColor(p)}`}>
                            {p}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WHATSAPP TAB */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">WhatsApp Business Chat</h3>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {whatsAppMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'business'
                        ? 'bg-[#D946EF] text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'business' ? 'text-white/70' : 'text-gray-600'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D946EF] text-sm"
                />
                <button className="px-4 py-2 bg-[#D946EF] text-white rounded-lg hover:shadow-lg transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHECK-INS TAB */}
        {activeTab === 'checkins' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm">Pending Check-ins</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                  {bookings.filter((b) => b.checkInStatus === 'pending').length}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm">Checked In</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                  {bookings.filter((b) => b.checkInStatus === 'checked_in').length}
                </p>
              </div>
            </div>

            {bookings
              .filter((b) => b.bookingStatus === 'confirmed')
              .map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-gray-900 sm:text-lg">{booking.name}</p>
                      <p className="text-gray-600 text-sm">{booking.propertyName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.checkInStatus === 'checked_in'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {booking.checkInStatus === 'pending' ? 'Pending' : 'Checked In'}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Check-in Code</p>
                    <p className="font-mono font-bold text-gray-900 text-sm">{booking.checkInCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-600 text-xs">Check-in Date</p>
                      <p className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Time</p>
                      <p className="font-bold text-gray-900">{booking.startTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-[#D946EF] text-white font-bold rounded-lg text-sm hover:shadow-lg transition">
                      Mark Checked In
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-200 transition">
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
