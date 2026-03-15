'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalCertificates: 0,
    totalMessages: 0,
    unreadMessages: 0
  })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    // Get projects count
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
    
    // Get certificates count
    const { data: certificates } = await supabase
      .from('certificates')
      .select('*')
    
    // Get messages
    const { data: messages } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    setStats({
      totalProjects: projects?.length || 0,
      featuredProjects: projects?.filter(p => p.featured).length || 0,
      totalCertificates: certificates?.length || 0,
      totalMessages: messages?.length || 0,
      unreadMessages: messages?.length || 0
    })
    
    setRecentMessages(messages || [])
    setLoading(false)
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: `${stats.featuredProjects} featured`,
      icon: '💼',
      gradient: 'from-purple-500 to-pink-500',
      action: () => router.push('/admin/projects')
    },
    {
      title: 'Certificates',
      value: stats.totalCertificates,
      subtitle: 'Professional credentials',
      icon: '🏆',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => router.push('/admin/certificates')
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      subtitle: `${stats.unreadMessages} new`,
      icon: '💬',
      gradient: 'from-green-500 to-emerald-500',
      action: () => router.push('/admin/messages')
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-600 text-lg">Here's what's happening with your portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{card.value}</div>
                <div className="text-sm text-gray-500">{card.subtitle}</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/admin/projects')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <span className="text-2xl">➕</span>
            <span className="font-semibold">Add New Project</span>
          </button>
          <button
            onClick={() => router.push('/admin/certificates')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <span className="text-2xl">🎓</span>
            <span className="font-semibold">Add Certificate</span>
          </button>
          <button
            onClick={() => router.push('/admin/about')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <span className="text-2xl">✏️</span>
            <span className="font-semibold">Edit About Info</span>
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <span className="text-2xl">🌐</span>
            <span className="font-semibold">View Live Site</span>
          </button>
        </div>
      </div>

      {/* Recent Messages */}
      {recentMessages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Messages</h2>
            <button
              onClick={() => router.push('/admin/messages')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                onClick={() => router.push('/admin/messages')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{msg.name}</h4>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}