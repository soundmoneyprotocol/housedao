'use client';

import React from 'react';
import { Home, Vote, Users, Zap, Lock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 text-white py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About HouseDAO</h1>
          <p className="text-lg sm:text-xl opacity-90">
            Fractional real estate ownership with decentralized governance.
            The future of property investment and community.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* What is HouseDAO */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">What is HouseDAO?</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              HouseDAO is a decentralized autonomous organization that revolutionizes real estate investment
              and community governance. Instead of traditional property ownership or Homeowners Associations (HOAs),
              HouseDAO enables fractional ownership of premium properties through blockchain-based shares.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Members purchase fractional shares in curated real estate properties—from art studios in Miami
              to luxury penthouses on Billionaires Row NYC and London. Every shareholder becomes a stakeholder
              with voting rights on property management, improvements, and dividend distributions.
            </p>
          </div>
        </section>

        {/* HouseDAO vs Traditional HOA */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">HouseDAO vs Traditional HOAs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* HOA */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional HOA</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">Limited to property owners and residents</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">Centralized decision-making by board members</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">Proposals require formal board approval</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">Voting power often unequal</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">High maintenance fees with unclear use</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700">Limited investment returns</span>
                </li>
              </ul>
            </div>

            {/* HouseDAO */}
            <div className="bg-white border border-[#0891B2]/30 rounded-xl p-8 ring-2 ring-[#0891B2]/20">
              <h3 className="text-2xl font-bold text-[#0891B2] mb-6">HouseDAO</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Global community of fractional share owners</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Decentralized governance via blockchain voting</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Any member can submit proposals on-chain</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Equal voting power per share</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Transparent dividend distributions from rental yields</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Annual returns from property appreciation & cash flow</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Home,
                title: 'Curated Properties',
                description: 'Premium properties selected for location, potential, and community appeal.'
              },
              {
                icon: Zap,
                title: 'Fractional Shares',
                description: 'Buy shares at any price point. No large down payment required.'
              },
              {
                icon: Vote,
                title: 'DAO Governance',
                description: 'Vote on property improvements, pricing, and capital allocation.'
              },
              {
                icon: TrendingUp,
                title: 'Dividend Yields',
                description: 'Earn annual returns from rental income and property appreciation.'
              },
              {
                icon: Users,
                title: 'Community Access',
                description: 'Network with like-minded investors and property enthusiasts globally.'
              },
              {
                icon: Lock,
                title: 'Transparent & Secure',
                description: 'Blockchain-based ownership, immutable records, and smart contracts.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                <feature.icon className="w-8 h-8 text-[#0891B2] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DAO Governance */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Decentralized Governance</h2>
          <div className="bg-gradient-to-br from-[#0891B2]/10 to-cyan-100 border border-[#0891B2]/30 rounded-xl p-8 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Any member can propose changes:</h3>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-[#0891B2] font-bold mt-1">→</span>
                <span className="text-gray-700"><strong>Capital Improvements:</strong> Renovations, equipment upgrades, maintenance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0891B2] font-bold mt-1">→</span>
                <span className="text-gray-700"><strong>Dividend Distributions:</strong> When and how frequently to distribute earnings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0891B2] font-bold mt-1">→</span>
                <span className="text-gray-700"><strong>Property Management:</strong> Booking policies, pricing tiers, event hosting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0891B2] font-bold mt-1">→</span>
                <span className="text-gray-700"><strong>Community Standards:</strong> Guidelines for property use and member conduct</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Voting is transparent:</strong> All proposals are visible on-chain, voting periods are announced in advance,
                and results are recorded permanently on the blockchain.
              </p>
            </div>
          </div>
        </section>

        {/* Investment Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why Invest Through HouseDAO?</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Lower Entry Price',
                description: 'Fractional ownership means you can invest with smaller amounts of capital.'
              },
              {
                title: 'Passive Income',
                description: 'Earn from booking rates (for hospitality properties) and ongoing rental income.'
              },
              {
                title: 'Diversification',
                description: 'Own shares in multiple premium properties across different cities and property types.'
              },
              {
                title: 'Liquidity',
                description: 'Trade your shares on the marketplace to exit positions or rebalance your portfolio.'
              },
              {
                title: 'Transparency',
                description: 'All property financials, voting records, and decisions are publicly viewable.'
              },
              {
                title: 'Community',
                description: 'Connect with global investors, artists, and entrepreneurs with shared values.'
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4">
                <div className="text-2xl text-[#0891B2] font-bold flex-shrink-0 w-8">0{idx + 1}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-700 mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-0">
          <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 rounded-xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Join the Future of Real Estate?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Invest in premium properties, earn passive income, and participate in decentralized governance.
              Your voice matters. Your investment grows.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/invest"
                className="px-8 py-3 bg-white text-[#0891B2] font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Explore Properties
              </Link>
              <Link
                href="/list-property"
                className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition border border-white/40"
              >
                List a Property
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
