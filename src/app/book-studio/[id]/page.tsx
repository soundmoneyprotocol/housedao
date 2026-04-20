'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, Share2, Check, AlertCircle, MapPin, Search, MessageCircle, Crown } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Property {
  id: string;
  name: string;
  city: string;
  description: string;
  imageUrl: string;
  hourlyRate: number;
  dailyRate: number;
  valuationUsd: number;
  annualYieldPercentage: number;
  maxShareSupply: number;
  latitude?: string;
  longitude?: string;
}

export default function BookPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [hours, setHours] = useState(1);
  const [days, setDays] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [messageToOwner, setMessageToOwner] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: string; lng: string } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [vvsMembership, setVvsMembership] = useState(false);
  const VVS_MEMBERSHIP_FEE = 4500;
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);


  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  // Initialize map coordinates from property if available
  useEffect(() => {
    if (property?.latitude && property?.longitude) {
      setMapCoordinates({ lat: property.latitude, lng: property.longitude });
    }
  }, [property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/homedao/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressSearch.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setSearchLoading(true);
    try {
      // Use Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressSearch)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        toast.error('Failed to search address');
        return;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMapCoordinates({
          lat: location.lat.toString(),
          lng: location.lng.toString(),
        });
        toast.success('Location found on map');
      } else {
        toast.error('Address not found. Try a different search.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Error searching address');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendMessageToOwner = async () => {
    if (!messageToOwner.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }

    setIsSendingMessage(true);
    try {
      const response = await fetch('/api/homedao/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property?.id,
          propertyName: property?.name,
          senderName: formData.name,
          senderEmail: formData.email,
          senderPhone: formData.phone,
          message: messageToOwner,
          bookingType,
          bookingDate: selectedDate,
        }),
      });

      if (response.ok) {
        toast.success('Message sent to venue owner!');
        setMessageToOwner('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <p className="text-gray-800 text-sm sm:text-base md:text-lg">Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-800 text-lg mb-4">Property not found</p>
          <Link href="/invest" className="text-[#0891B2] hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const calculateBookingTotal = () => {
    let total = 0;
    if (bookingType === 'hourly') {
      total = hours * property.hourlyRate;
    } else {
      total = days * property.dailyRate;
    }
    if (vvsMembership) {
      total += VVS_MEMBERSHIP_FEE;
    }
    return total;
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated first
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (!selectedDate || !formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking record
      const bookingResponse = await fetch('/api/homedao/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyName: property.name,
          bookingType,
          startDate: selectedDate,
          startTime: bookingType === 'hourly' ? startTime : '00:00',
          duration: bookingType === 'hourly' ? hours : days,
          durationUnit: bookingType === 'hourly' ? 'hours' : 'days',
          totalPrice: calculateBookingTotal(),
          vvsMembership,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (bookingResponse.ok) {
        const booking = await bookingResponse.json();

        // Create Stripe checkout session
        const stripeResponse = await fetch('/api/homedao/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id || propertyId,
            propertyName: property.name,
            amount: calculateBookingTotal(),
            email: formData.email,
            bookingDetails: {
              date: selectedDate,
              time: bookingType === 'hourly' ? startTime : 'All day',
              duration: `${bookingType === 'hourly' ? hours : days} ${bookingType === 'hourly' ? 'hour(s)' : 'day(s)'}`,
            },
          }),
        });

        if (stripeResponse.ok) {
          const { url } = await stripeResponse.json();
          if (url) {
            window.location.href = url;
          } else {
            toast.success('Booking confirmed! Payment details will be sent to your email.');
            setTimeout(() => {
              window.history.back();
            }, 2000);
          }
        } else {
          toast.success('Booking created! Payment information has been sent to your email.');
          setTimeout(() => {
            window.history.back();
          }, 2000);
        }
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Error processing booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const mapUrl = mapCoordinates
    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.2!2d${mapCoordinates.lng}!3d${mapCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${mapCoordinates.lat},${mapCoordinates.lng}!5e0!3m2!1sen!2sus!4v`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white py-4 sm:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <Link href={`/property/${propertyId}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3 sm:mb-4 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Property
          </Link>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">{property.name}</h1>
          <p className="text-white/90 text-sm sm:text-base">{property.city}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleBookingSubmit} className="space-y-6 sm:space-y-8">
              {/* Booking Type & Date */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#0891B2]" />
                  Select Date & Time
                </h2>

                {/* Booking Type Selection */}
                <div className="mb-6 sm:mb-8">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 sm:mb-4">Booking Type</label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setBookingType('hourly')}
                      className={`p-3 sm:p-4 border-2 rounded-lg transition text-sm sm:text-base ${
                        bookingType === 'hourly'
                          ? 'border-[#0891B2] bg-[#0891B2]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Clock className="w-5 h-5 sm:w-5 sm:h-5 mx-auto mb-2 text-[#0891B2]" />
                      <div className="font-bold text-gray-900">Hourly</div>
                      <div className="text-xs sm:text-sm text-gray-600">${property.hourlyRate}/hr</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingType('daily')}
                      className={`p-3 sm:p-4 border-2 rounded-lg transition text-sm sm:text-base ${
                        bookingType === 'daily'
                          ? 'border-[#0891B2] bg-[#0891B2]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Calendar className="w-5 h-5 sm:w-5 sm:h-5 mx-auto mb-2 text-[#0891B2]" />
                      <div className="font-bold text-gray-900">Daily</div>
                      <div className="text-xs sm:text-sm text-gray-600">${property.dailyRate}/day</div>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6 sm:mb-8">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateSelect}
                    min={getTodayDate()}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Time & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {bookingType === 'hourly' && (
                    <>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Duration (Hrs)</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHours(Math.max(1, hours - 1))}
                            className="px-2 sm:px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={hours}
                            onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-center text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setHours(Math.min(24, hours + 1))}
                            className="px-2 sm:px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {bookingType === 'daily' && (
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Number of Days</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDays(Math.max(1, days - 1))}
                          className="px-2 sm:px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={days}
                          onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-center text-sm sm:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setDays(Math.min(365, days + 1))}
                          className="px-2 sm:px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#0891B2]" />
                  Location
                </h2>

                {/* Address Search */}
                <form onSubmit={handleAddressSearch} className="mb-6 sm:mb-8">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Search Location or Enter Address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                      placeholder="e.g., '123 Main St, New York, NY' or paste Google Maps link"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                    />
                    <button
                      type="submit"
                      disabled={searchLoading}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-[#0891B2] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#0891B2]/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </form>

                {/* Coordinates */}
                {mapCoordinates && (
                  <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-600 text-xs sm:text-sm">Latitude</p>
                      <p className="font-mono font-bold text-gray-900 text-sm sm:text-base">{mapCoordinates.lat}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-600 text-xs sm:text-sm">Longitude</p>
                      <p className="font-mono font-bold text-gray-900 text-sm sm:text-base">{mapCoordinates.lng}</p>
                    </div>
                  </div>
                )}

                {/* Google Map */}
                {mapUrl && (
                  <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapUrl}
                    />
                  </div>
                )}

                {!mapCoordinates && (
                  <div className="w-full h-64 sm:h-80 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                    Search for a location to view the map
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Contact Info</h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="John Doe"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="john@example.com"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message to Venue Owner */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#0891B2]" />
                  Send Message to Venue Owner
                </h2>

                <div className="space-y-4">
                  <textarea
                    value={messageToOwner}
                    onChange={(e) => setMessageToOwner(e.target.value)}
                    placeholder="Let the venue owner know about any special requests or questions..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent text-sm sm:text-base resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">Optional - Share special requests or questions with the venue owner</p>
                  <button
                    type="button"
                    onClick={handleSendMessageToOwner}
                    disabled={isSendingMessage || !messageToOwner.trim()}
                    className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isSendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#0891B2] to-pink-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#0891B2]/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>

          {/* Booking Summary - Sticky on desktop, below form on mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:sticky lg:top-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Summary</h3>

              <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-200 text-sm sm:text-base">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Property</p>
                  <p className="font-bold text-gray-900">{property.name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Type</p>
                  <p className="font-bold text-gray-900 capitalize">{bookingType}</p>
                </div>

                {selectedDate && (
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Date</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {bookingType === 'hourly' && (
                  <>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm">Time</p>
                      <p className="font-bold text-gray-900">{startTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm">Duration</p>
                      <p className="font-bold text-gray-900">{hours}h</p>
                    </div>
                  </>
                )}

                {bookingType === 'daily' && (
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Duration</p>
                    <p className="font-bold text-gray-900">{days}d</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="py-4 sm:py-6 space-y-3">
                <div className="space-y-2 pb-3 border-b border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {bookingType === 'hourly' ? `${hours}h × $${property.hourlyRate}` : `${days}d × $${property.dailyRate}`}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${bookingType === 'hourly' ? hours * property.hourlyRate : days * property.dailyRate}
                    </span>
                  </div>
                  {vvsMembership && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">VVS Membership</span>
                      <span className="font-semibold text-gray-900">${VVS_MEMBERSHIP_FEE}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#0891B2]">${calculateBookingTotal()}</span>
                </div>
                <p className="text-xs text-gray-600">Secure payment via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to book</h2>
            <p className="text-gray-600 mb-6">
              Create an account or sign in to book this property.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  router.push('/signup');
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  router.push('/login');
                }}
                className="w-full py-3 px-4 border-2 border-[#0891B2] text-[#0891B2] font-bold rounded-lg hover:bg-cyan-50 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full py-3 px-4 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
