'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, Share2 } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface Investment {
  id: string;
  propertyId: string;
  propertyName: string;
  city: string;
  shares: number;
  sharePrice: number;
  investmentAmount: number;
  currentValue: number;
  annualROI: number;
  yearlyReturn: number;
  dividendsEarned: number;
  investedDate: string;
}

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockInvestments: Investment[] = [
      {
        id: '1',
        propertyId: '1',
        propertyName: 'Miami Recording Studio',
        city: 'Miami',
        shares: 50,
        sharePrice: 1250,
        investmentAmount: 62500,
        currentValue: 68750,
        annualROI: 7.5,
        yearlyReturn: 4687.50,
        dividendsEarned: 2343.75,
        investedDate: '2024-01-15',
      },
      {
        id: '2',
        propertyId: '2',
        propertyName: 'NYC Penthouse',
        city: 'New York',
        shares: 25,
        sharePrice: 2500,
        investmentAmount: 62500,
        currentValue: 65000,
        annualROI: 6.2,
        yearlyReturn: 3875,
        dividendsEarned: 1937.50,
        investedDate: '2024-02-20',
      },
      {
        id: '3',
        propertyId: '3',
        propertyName: 'London Townhouse',
        city: 'London',
        shares: 100,
        sharePrice: 850,
        investmentAmount: 85000,
        currentValue: 89250,
        annualROI: 8.1,
        yearlyReturn: 6887.50,
        dividendsEarned: 3443.75,
        investedDate: '2024-03-10',
      },
    ];
    setInvestments(mockInvestments);
    setLoading(false);
  }, []);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalDividends = investments.reduce((sum, inv) => sum + inv.dividendsEarned, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">My Portfolio</h1>
            <p className="text-lg opacity-90">
              Track your investments, earnings, and property holdings
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading portfolio...</p>
            </div>
          ) : (
            <>
              {/* Portfolio Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {/* Total Invested */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 font-semibold">Total Invested</h3>
                    <DollarSign className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{investments.length} properties</p>
                </div>

                {/* Current Value */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 font-semibold">Current Value</h3>
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalCurrentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-green-600 mt-2">+${totalGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>

                {/* Total Gain */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 font-semibold">Total Gain</h3>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {gainPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">${totalGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>

                {/* Dividends Earned */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 font-semibold">Dividends</h3>
                    <Share2 className="w-5 h-5 text-cyan-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalDividends.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Earned</p>
                </div>
              </div>

              {/* Investments Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Property</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Shares</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Investment</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Current Value</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Gain/Loss</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Annual Return</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv, idx) => (
                        <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{inv.propertyName}</p>
                              <p className="text-xs text-gray-500">{inv.city}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{inv.shares}</td>
                          <td className="px-6 py-4 text-gray-700">
                            ${inv.investmentAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">
                            ${inv.currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-semibold">
                              +${(inv.currentValue - inv.investmentAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">${inv.yearlyReturn.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                              <p className="text-xs text-gray-500">{inv.annualROI.toFixed(1)}% ROI</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/property/${inv.propertyId}`}
                              className="text-[#0891B2] hover:text-cyan-600 font-semibold text-sm"
                            >
                              View
                            </Link>
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
    </>
  );
}
