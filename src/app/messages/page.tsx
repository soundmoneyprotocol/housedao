'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import Header from '../../components/Header';

interface Message {
  id: string;
  conversationId: string;
  senderName: string;
  propertyName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar: string;
}

interface Conversation {
  id: string;
  messages: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    const mockConversations: Message[] = [
      {
        id: '1',
        conversationId: 'conv1',
        senderName: 'Sarah Manager',
        propertyName: 'Miami Recording Studio',
        lastMessage: 'The studio is ready for your booking. Looking forward to hosting you!',
        timestamp: '2024-04-05 10:30',
        unread: false,
        avatar: '👩‍💼',
      },
      {
        id: '2',
        conversationId: 'conv2',
        senderName: 'Michael Host',
        propertyName: 'NYC Penthouse',
        lastMessage: 'Thanks for the booking confirmation. See you next week!',
        timestamp: '2024-04-04 14:15',
        unread: true,
        avatar: '👨‍💼',
      },
      {
        id: '3',
        conversationId: 'conv3',
        senderName: 'Emma Curator',
        propertyName: 'London Townhouse',
        lastMessage: 'Could you provide more details about your event?',
        timestamp: '2024-04-03 09:45',
        unread: true,
        avatar: '👩‍🎨',
      },
    ];
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Mock send message
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0891B2] to-cyan-400 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Messages</h1>
            <p className="text-lg opacity-90">
              Communicate with property managers and hosts
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
              {/* Conversations List */}
              <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No conversations found</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation({ id: conv.conversationId, messages: [] })}
                        className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition ${
                          selectedConversation?.id === conv.conversationId ? 'bg-blue-50 border-l-4 border-l-[#0891B2]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{conv.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm ${conv.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {conv.senderName}
                            </p>
                            <p className="text-xs text-gray-500">{conv.propertyName}</p>
                            <p className="text-xs text-gray-600 truncate mt-1">{conv.lastMessage}</p>
                          </div>
                          {conv.unread && (
                            <div className="w-2 h-2 bg-[#0891B2] rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Conversation View */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {conversations.find(c => c.conversationId === selectedConversation.id)?.senderName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversations.find(c => c.conversationId === selectedConversation.id)?.propertyName}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="space-y-4">
                        {/* Sample messages */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm text-gray-800">Hi! I'm interested in booking your property.</p>
                            <p className="text-xs text-gray-500 mt-1">10:00 AM</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-[#0891B2] text-white rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Great! When would you like to book?</p>
                            <p className="text-xs opacity-75 mt-1">10:05 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="p-2 bg-[#0891B2] text-white rounded-lg hover:bg-cyan-600 transition"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
