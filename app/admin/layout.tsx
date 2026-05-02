'use client'

import { type User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'DB' },
  { name: 'Site Settings', path: '/admin/site-settings', icon: 'SS' },
  { name: 'Hero Stats', path: '/admin/hero-stats', icon: 'HS' },
  { name: 'Timeline', path: '/admin/timeline', icon: 'TL' },
  { name: 'Projects', path: '/admin/projects', icon: 'PR' },
  { name: 'Certificates', path: '/admin/certificates', icon: 'CF' },
  { name: 'Services', path: '/admin/services', icon: 'SV' },
  { name: 'Roadmap', path: '/admin/roadmap', icon: 'RM' },
  { name: 'Messages', path: '/admin/messages', icon: 'MS' },
  { name: 'About & Skills', path: '/admin/about', icon: 'AB' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      const {
        data: { user: nextUser },
      } = await supabase.auth.getUser()

      if (cancelled) {
        return
      }

      if (!nextUser && pathname !== '/admin') {
        router.push('/admin')
        return
      }

      setUser(nextUser)
      setLoading(false)
    }

    void loadUser()

    return () => {
      cancelled = true
    }
  }, [pathname, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (pathname === '/admin') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-xl text-gray-600">Loading admin...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 p-6">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
        </div>

        <nav className="space-y-2 p-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => router.push(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                pathname === item.path
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-xs font-bold">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-2 w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition-all hover:bg-gray-100"
          >
            View Site
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 min-h-screen">
        <div className="max-w-7xl p-8">{children}</div>
      </main>
    </div>
  )
}
