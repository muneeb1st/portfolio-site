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
  { name: 'Skill Stack', path: '/admin/skill-stack', icon: 'SK' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-gray-600">Loading admin...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-700 bg-slate-900 shadow-xl transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold text-white">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
        </div>

        <nav className="space-y-2 p-4 h-[calc(100vh-160px)] overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => { router.push(item.path); setSidebarOpen(false) }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                pathname === item.path
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-slate-300">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4 bg-slate-900">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-2 w-full rounded-lg px-4 py-2 text-sm text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
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

      <main className="min-h-screen lg:ml-72">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Open menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-slate-900">Admin Panel</span>
        </div>
        <div className="max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

