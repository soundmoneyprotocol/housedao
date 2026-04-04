'use client';

import React from 'react';
import { Crown, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">VVS Membership Tiers</h1>
          <p className="text-lg sm:text-xl opacity-90">
            Cut above the rest. Color the room creatively. Carats is the heavy weight in the room.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Diamond Clarity Scale */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            Diamond Clarity Scale
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Like diamonds, HouseDAO memberships are graded by clarity—from the purest Flawless to the accessible SI tiers.
            Each level unlocks new opportunities and experiences.
          </p>

          {/* Tier Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* SI Tier */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">◆</span>
                <h3 className="text-xl font-bold text-gray-900">SI Tier</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Slightly Included - Entry Level</p>
              <div className="space-y-2 text-sm mb-6">
                <p><strong>Access:</strong> General event entry</p>
                <p><strong>Key:</strong> Digital QR code pass</p>
                <p><strong>Best for:</strong> First-time attendees</p>
              </div>
              <button className="w-full py-2 px-4 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition">
                Learn More
              </button>
            </div>

            {/* VS Tier */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">◆◆</span>
                <h3 className="text-xl font-bold text-gray-900">VS Tier</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Very Slightly Included - Standard</p>
              <div className="space-y-2 text-sm mb-6">
                <p><strong>Access:</strong> Named guest list entry</p>
                <p><strong>Key:</strong> Digital pass + wristband</p>
                <p><strong>Best for:</strong> Professionals & investors</p>
              </div>
              <button className="w-full py-2 px-4 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition">
                Learn More
              </button>
            </div>

            {/* VVS Tier */}
            <div className="bg-gradient-to-br from-[#0891B2]/10 to-cyan-100 border-2 border-[#0891B2] rounded-xl p-6 hover:shadow-lg transition ring-2 ring-[#0891B2]/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#0891B2]" />
                <h3 className="text-xl font-bold text-[#0891B2]">VVS Tier</h3>
              </div>
              <p className="text-sm text-[#0891B2] font-bold mb-4">Very Very Slightly Included - Premium</p>
              <div className="space-y-2 text-sm mb-6">
                <p><strong>Access:</strong> VIP lounge, early registration</p>
                <p><strong>Key:</strong> Digital access pass + unique ID</p>
                <p><strong>Price:</strong> $4,500 per experience</p>
                <p><strong>Best for:</strong> Active investors & curators</p>
              </div>
              <button className="w-full py-2 px-4 bg-[#0891B2] text-white font-bold rounded-lg hover:bg-cyan-600 transition">
                Join VVS Tier
              </button>
            </div>

            {/* Flawless Tier */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-600 rounded-xl p-6 hover:shadow-lg transition ring-2 ring-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-900">Flawless Tier</h3>
              </div>
              <p className="text-sm text-purple-600 font-bold mb-4">Flawless - Elite Circle</p>
              <div className="space-y-2 text-sm mb-6">
                <p><strong>Access:</strong> All areas, private events</p>
                <p><strong>Key:</strong> Bespoke physical pass or NFT</p>
                <p><strong>Price:</strong> By invitation only</p>
                <p><strong>Best for:</strong> Elite investors & influencers</p>
              </div>
              <button className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
                Apply for Flawless
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            What Each Tier Includes
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">SI</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">VS</th>
                  <th className="px-6 py-4 text-center font-bold text-[#0891B2]">VVS</th>
                  <th className="px-6 py-4 text-center font-bold text-purple-600">Flawless</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'General Event Entry', si: '✓', vs: '✓', vvs: '✓', flawless: '✓' },
                  { feature: 'Digital Pass', si: '✓', vs: '✓', vvs: '✓', flawless: '✓' },
                  { feature: 'Basic Networking', si: '✓', vs: '✓', vvs: '✓', flawless: '✓' },
                  { feature: 'VIP Lounge Access', si: '✗', vs: '✓', vvs: '✓', flawless: '✓' },
                  { feature: 'Early Registration', si: '✗', vs: '✗', vvs: '✓', flawless: '✓' },
                  { feature: 'Curated Networking', si: '✗', vs: '✗', vvs: '✓', flawless: '✓' },
                  { feature: 'Member Directory', si: '✗', vs: '✗', vvs: '✓', flawless: '✓' },
                  { feature: 'Private Events', si: '✗', vs: '✗', vvs: '✗', flawless: '✓' },
                  { feature: 'Direct Curator Access', si: '✗', vs: '✗', vvs: '✗', flawless: '✓' },
                  { feature: 'Bespoke Experiences', si: '✗', vs: '✗', vvs: '✗', flawless: '✓' },
                  { feature: '1-on-1 Introductions', si: '✗', vs: '✗', vvs: '✗', flawless: '✓' },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row.si}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row.vs}</td>
                    <td className="px-6 py-4 text-center text-[#0891B2] font-bold">{row.vvs}</td>
                    <td className="px-6 py-4 text-center text-purple-600 font-bold">{row.flawless}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Upgrade */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            How to Join & Upgrade
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SI/VS Path */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">SI → VS Path</h3>
              <ol className="space-y-4">
                {[
                  { num: 1, text: 'Register on HouseDAO (free)' },
                  { num: 2, text: 'Purchase a general ticket ($100-$200)' },
                  { num: 3, text: 'Receive digital pass via email' },
                  { num: 4, text: 'Check in at the event with QR code' },
                  { num: 5, text: 'Optional: Upgrade to VS for enhanced access' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold flex-shrink-0">
                      {step.num}
                    </div>
                    <p className="text-gray-700">{step.text}</p>
                  </div>
                ))}
              </ol>
            </div>

            {/* VVS/Flawless Path */}
            <div className="bg-gradient-to-br from-[#0891B2]/10 to-cyan-100 border-2 border-[#0891B2] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-[#0891B2] mb-6">VVS → Flawless Path</h3>
              <ol className="space-y-4">
                {[
                  { num: 1, text: 'Be an active VS/VVS member' },
                  { num: 2, text: 'Receive invitation from Flawless member' },
                  { num: 3, text: 'Complete professional profile review' },
                  { num: 4, text: 'Get approved by HouseDAO council' },
                  { num: 5, text: 'Receive bespoke Flawless pass (physical or NFT)' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0891B2] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {step.num}
                    </div>
                    <p className="text-gray-700">{step.text}</p>
                  </div>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 rounded-xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Find Your Tier</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're just exploring or ready for elite experiences, there's a tier for you.
              Join the HouseDAO community today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/invest"
                className="px-8 py-3 bg-white text-[#0891B2] font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Explore Properties
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition border border-white/40"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
