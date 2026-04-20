'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  instagram?: string;
  experienceType: 'wellness' | 'buyout' | 'founder-house' | '';
  groupSize: 'solo' | '2-3' | '4-5' | '6-8' | '9+' | '';
  goals: string[];
  budgetRange: '<2.5k' | '2.5-5k' | '5-7k' | '7k+' | '';
  dates: 'asap' | '1-3-months' | '3-6-months' | 'flexible' | '';
  intentLevel: 'exploring' | 'considering' | 'ready' | '';
  luxuryExperience: boolean;
  exceptionalWish: string;
  additionalInfo: string;
}

const goalOptions = [
  'Rest & Recovery',
  'Learning & Growth',
  'Team Bonding',
  'Strategic Planning',
  'Wellness & Health',
  'Creative Renewal',
];

export default function VVSApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    instagram: '',
    experienceType: '',
    groupSize: '',
    goals: [],
    budgetRange: '',
    dates: '',
    intentLevel: '',
    luxuryExperience: false,
    exceptionalWish: '',
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.whatsapp) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.experienceType || !formData.groupSize || !formData.budgetRange) {
      toast.error('Please complete all form sections');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/vvs/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();
      setSubmitted(true);
      toast.success('Application submitted! We\'ll review it within 24 hours.');

      // Scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">You're Approved!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been received. We review every submission personally to ensure fit.
          </p>
          <p className="text-gray-700 font-semibold mb-6">
            You'll hear from our team within 24 hours with personalized options and next steps.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Start Your Application
            </h1>
            <p className="text-gray-600 text-lg">
              Tell us about your ideal VVS experience. We'll review within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Identity */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Your Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram / LinkedIn
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@yourhandle or linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Fit */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Your Fit
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Type *
                  </label>
                  <select
                    name="experienceType"
                    value={formData.experienceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an experience</option>
                    <option value="wellness">Wellness Retreat (5-6 days)</option>
                    <option value="buyout">Private Buyout (full villa)</option>
                    <option value="founder-house">Founder House (7 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Size *
                  </label>
                  <select
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">How many people?</option>
                    <option value="solo">Just me</option>
                    <option value="2-3">2-3 people</option>
                    <option value="4-5">4-5 people</option>
                    <option value="6-8">6-8 people (optimal)</option>
                    <option value="9+">9+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What's most important to you? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <label key={goal} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                          className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Budget & Intent */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Budget & Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget per person *
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">What's your budget?</option>
                    <option value="<2.5k">Less than $2,500</option>
                    <option value="2.5-5k">$2,500 - $5,000</option>
                    <option value="5-7k">$5,000 - $7,000</option>
                    <option value="7k+">$7,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    When are you thinking? *
                  </label>
                  <select
                    name="dates"
                    value={formData.dates}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select timeframe</option>
                    <option value="asap">ASAP (next 30 days)</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="flexible">Flexible / next year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How committed are you? *
                  </label>
                  <select
                    name="intentLevel"
                    value={formData.intentLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select commitment level</option>
                    <option value="exploring">Just exploring</option>
                    <option value="considering">Seriously considering</option>
                    <option value="ready">Ready to go</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Quality Filter */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Final Details
              </h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="luxuryExperience"
                    checked={formData.luxuryExperience}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">
                    I've done luxury experiences before
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What would make this exceptional for you?
                  </label>
                  <textarea
                    name="exceptionalWish"
                    value={formData.exceptionalWish}
                    onChange={handleInputChange}
                    placeholder="Tell us what matters most to make this experience special..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anything else we should know?
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Share any other details that help us understand your needs..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              ✓ Applications reviewed within 24 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
