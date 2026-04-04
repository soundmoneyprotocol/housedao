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

        {/* HouseDAO vs REITs */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">HouseDAO vs Traditional REITs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional REIT */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional REIT (e.g., Vanguard Real Estate ETF)</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>Locked-in investment periods</strong> - Often require long-term holding with early exit penalties</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>Limited liquidity</strong> - Can take days or weeks to sell shares, especially during market downturns</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>No voting rights</strong> - Shareholders have no say in property management decisions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>Opaque operations</strong> - Limited visibility into individual property performance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>High minimum investments</strong> - Typically require $5,000+ to invest</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-xl flex-shrink-0">✕</span>
                  <span className="text-gray-700"><strong>Centralized management</strong> - REIT company makes all decisions</span>
                </li>
              </ul>
            </div>

            {/* HouseDAO */}
            <div className="bg-white border border-[#0891B2]/30 rounded-xl p-8 ring-2 ring-[#0891B2]/20">
              <h3 className="text-2xl font-bold text-[#0891B2] mb-6">HouseDAO - Blockchain Fractional Ownership</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Instant liquidity</strong> - Trade your shares on the marketplace anytime, in minutes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Seamless exit options</strong> - Sell shares immediately without lock-in periods or penalties</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Full governance rights</strong> - Vote on all property decisions and submit proposals</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Complete transparency</strong> - All property data and financial metrics visible on-chain</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Low entry barrier</strong> - Start investing with any amount, buy individual shares</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0891B2] font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700"><strong>Decentralized governance</strong> - Members collectively decide property strategy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Liquidity Highlight */}
          <div className="mt-8 bg-gradient-to-br from-[#0891B2]/10 to-cyan-100 border-2 border-[#0891B2] rounded-xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Blockchain Liquidity Matters</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Traditional REITs can lock investors in for months or years. If you need to access your capital in an emergency,
                you're often forced to sell at market rates or face penalties. <strong>With HouseDAO, your shares are always tradable.</strong>
              </p>
              <p className="text-gray-700">
                Your fractional shares exist as tokens on the blockchain. Want to exit? Simply list your shares on the marketplace.
                Another investor can buy them instantly—no approval required, no waiting period, no penalties.
              </p>
              <p className="text-[#0891B2] font-bold text-lg">
                You own your investment. You decide when to buy or sell. No intermediary can tell you to wait.
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
