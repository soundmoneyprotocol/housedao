'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Eye, EyeOff } from 'lucide-react';
import Header from '../../components/Header';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  newsletter: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    firstName: 'John',
    lastName: 'Investor',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Real estate investor and music enthusiast',
    newsletter: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveSettings = () => {
    setSuccessMessage('Settings saved successfully!');
    setEditMode(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setSuccessMessage('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-lg opacity-90">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">
              ✓ {successMessage}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0891B2] to-cyan-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{settings.firstName} {settings.lastName}</h2>
                  <p className="text-gray-600">{settings.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  editMode
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-[#0891B2] text-white hover:bg-cyan-600'
                }`}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-6">
                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={settings.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={settings.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={settings.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full px-6 py-3 bg-[#0891B2] text-white font-bold rounded-lg hover:bg-cyan-600 transition"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{settings.firstName} {settings.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{settings.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{settings.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="font-semibold">{settings.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0891B2]" />
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full px-6 py-3 bg-[#0891B2] text-white font-bold rounded-lg hover:bg-cyan-600 transition"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0891B2]" />
              Notifications & Preferences
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded text-[#0891B2] focus:ring-2 focus:ring-[#0891B2]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive booking and investment updates via email</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded text-[#0891B2] focus:ring-2 focus:ring-[#0891B2]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive real-time alerts on your device</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={settings.newsletter}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded text-[#0891B2] focus:ring-2 focus:ring-[#0891B2]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Newsletter</p>
                  <p className="text-sm text-gray-600">Subscribe to our weekly property and investment updates</p>
                </div>
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full mt-6 px-6 py-3 bg-[#0891B2] text-white font-bold rounded-lg hover:bg-cyan-600 transition"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
