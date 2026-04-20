'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Users, Utensils, Zap, Check } from 'lucide-react';
import Link from 'next/link';
import VVSApplicationForm from '@/components/VVSApplicationForm';

const testimonials = [
  {
    quote: "Changed my perspective on work-life balance. Best investment I've made in myself.",
    author: 'Sarah, CEO',
    background: 'from-amber-500 to-orange-500',
  },
  {
    quote: "Our team came for 5 days and left transformed. This is the best corporate retreat we've done.",
    author: 'Marcus, Founder',
    background: 'from-orange-500 to-red-500',
  },
  {
    quote: "I didn't want to leave. The intentionality of every detail made all the difference.",
    author: 'Jennifer, Creator',
    background: 'from-red-500 to-rose-500',
  },
];

const experienceTypes = [
  {
    icon: '',
    title: 'Wellness Retreat',
    description: '5–6 days of breathwork, yoga, recovery, and reset',
    price: '$3,500/person',
    minimum: '8-guest minimum',
    includes: ['Curated wellness activities', 'Chef meals', 'Sauna & hydrotherapy pool', 'Excursions'],
  },
  {
    icon: '',
    title: 'Private Buyout',
    description: 'Full villa for your group, fully customized',
    price: '$1,800/night',
    minimum: '3-night minimum',
    includes: ['Entire villa (4 bed, 5 bath)', 'Personal concierge', 'Chef available', 'Custom itinerary'],
  },
  {
    icon: '',
    title: 'Founder House',
    description: '7-day retreat for builders, creators, high-performers',
    price: '$5,000–$8,000/person',
    minimum: 'Vetted audience',
    includes: ['Work sessions', 'Networking', 'Wellness', 'Concierge lifestyle'],
  },
];

const whatIncluded = [
  'Private villa (4 bed, 5 bath, infinity pool)',
  'Meals prepared by private chef (3 meals daily)',
  'Curated activities & local excursions',
  'Wellness center (sauna, hydrotherapy, massage)',
  'Full concierge service',
  'WiFi + complete connectivity',
  '6–8 guests max (intimate, not crowded)',
  '1-minute walk to the beach',
];

export default function VVSPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [scrollToForm, setScrollToForm] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              VVS Flawless
            </Link>
            <button
              onClick={() => setScrollToForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Apply Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center px-4">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            A Private Oceanfront Villa Experience
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Curated, Not Booked
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Not a hotel. Not an Airbnb. A transformational retreat with chef, concierge, and intentional community.
          </p>
          <button
            onClick={() => setScrollToForm(true)}
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Apply for an Experience
          </button>
        </div>
      </section>

      {/* Positioning Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              This Is not a Hotel. This Is not an Airbnb.
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Most luxury properties offer rooms and amenities. We curate the entire experience—chef, activities, the
              right people, intentional downtime. You are not booking a place; you are investing in a reset.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-amber-50 border border-amber-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intentional Design</h3>
              <p className="text-gray-700">
                Every detail—from meals to activities to group composition—is designed for your specific goals.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-orange-50 border border-orange-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intimate Group</h3>
              <p className="text-gray-700">
                Max 8 guests. Small enough for genuine connection, large enough for energy and diverse perspectives.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-rose-50 border border-rose-100">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full Service</h3>
              <p className="text-gray-700">
                Chef, concierge, activities, transportation—we handle everything so you can focus on connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What is Included</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Property Info */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              <div className="h-64 bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Private Villa</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <span></span> 4 bedrooms, 5 bathrooms
                  </p>
                  <p className="flex items-center gap-2">
                    <span></span> Infinity pool overlooking ocean
                  </p>
                  <p className="flex items-center gap-2">
                    <span></span> Wellness center (sauna, hydrotherapy, massage)
                  </p>
                  <p className="flex items-center gap-2">
                    <span></span> Full gym + outdoor kitchen
                  </p>
                  <p className="flex items-center gap-2">
                    <span></span> 1-minute walk to the beach
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {whatIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Types Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Experience Types</h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Choose what aligns with your goals and group
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {experienceTypes.map((exp, idx) => (
              <div
                key={idx}
                className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100"
              >
                <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="text-5xl mb-4">{exp.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-xl font-bold text-amber-600">{exp.price}</p>
                    <p className="text-sm text-gray-600">{exp.minimum}</p>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {exp.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Curated Experiences, Real Results</h2>
          <p className="text-lg text-gray-600 text-center mb-12">Hear from guests who experienced the VVS difference</p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl"></span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scarcity & Urgency */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Most Experiences Fill Before Being Publicly Listed</h2>
          <p className="text-xl mb-8 opacity-90">Only 2–3 spots available for April–June.</p>
          <button
            onClick={() => setScrollToForm(true)}
            className="inline-block px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Apply Now - Limited Spots Available
          </button>
        </div>
      </section>

      {/* Pricing Frame */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center border-2 border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment, Not Expense</h2>
            <p className="text-6xl font-bold text-amber-600 mb-4">$2,500–$7,000+</p>
            <p className="text-lg text-gray-700 mb-6">per guest • Includes meals, activities, accommodation, concierge</p>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Think of it as an annual investment in yourself or your team. One week that shifts your perspective,
              resets your energy, and creates lasting connections.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Is VVS Right for You?</h2>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <Check className="w-6 h-6" /> You Ready If:
            </h3>
            <ul className="space-y-3">
              {[
                "You value curated experiences over standard travel",
                "You willing to invest $2,500+ for transformational experience",
                "You open to authentic connection with others",
                "You want personal concierge accompaniment to your wellness experience",
                "You appreciate intentional design & attention to detail",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold mt-1"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section
        className={`py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50 transition-all ${
          scrollToForm ? '' : ''
        }`}
      >
        {scrollToForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <VVSApplicationForm />
          </div>
        )}

        {!scrollToForm && (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Apply?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Quick application, personalized response within 24 hours
            </p>
            <button
              onClick={() => setScrollToForm(true)}
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Start Application
            </button>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                id: 'dates',
                q: 'Can I choose my own dates?',
                a: 'Yes! We work with your schedule. Most experiences are in spring/fall, but we accommodate requests.',
              },
              {
                id: 'group',
                q: 'Do I need to come with a group?',
                a: 'No. We offer both private group buyouts and curated 8-person wellness retreats where you will meet other high-performers.',
              },
              {
                id: 'location',
                a: 'The villa is in Huatulco, Mexico (Oaxaca state). It is 26 minutes from Huatulco International Airport and 1 minute to Playa Organo beach.',
                q: 'Where exactly is the villa?',
              },
              {
                id: 'cancel',
                q: 'What is your cancellation policy?',
                a: 'Refundable with 60+ days notice. Within 60 days, deposit is non-refundable (standard luxury booking terms).',
              },
              {
                id: 'partner',
                q: 'Can I bring a partner or spouse?',
                a: 'Absolutely! Couples are welcome. Group experiences foster connection; private buyouts are fully customizable.',
              },
            ].map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6 text-gray-700 border-t border-gray-200 bg-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Applications Reviewed Within 24 Hours</h2>
        <p className="text-lg mb-8 opacity-90">
          Next step: Tell us about your ideal experience. We will be in touch with personalized options.
        </p>
        <button
          onClick={() => setScrollToForm(true)}
          className="inline-block px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105"
        >
          Apply Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4">VVS Flawless • Miami, London, NYC, Worldwide</p>
          <p className="text-sm">
            Luxury oceanfront wellness estate | Curated experiences | Fractional ownership via HouseDAO
          </p>
          <p className="text-xs mt-8 text-gray-600">© 2026 VVS Flawless. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
