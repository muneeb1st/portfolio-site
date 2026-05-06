'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'

interface ProjectRow {
  id: string
  featured: boolean | null
}

interface CertificateRow {
  id: string
}

interface MessageRow {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

interface DashboardStats {
  totalProjects: number
  featuredProjects: number
  totalCertificates: number
  totalMessages: number
  unreadMessages: number
}

interface DashboardNotice {
  tone: 'warning' | 'info'
  message: string
}

const emptyStats: DashboardStats = {
  totalProjects: 0,
  featuredProjects: 0,
  totalCertificates: 0,
  totalMessages: 0,
  unreadMessages: 0,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [recentMessages, setRecentMessages] = useState<MessageRow[]>([])
  const [contentAdminReady, setContentAdminReady] = useState(true)
  const [notice, setNotice] = useState<DashboardNotice | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      const [projectsResult, certificatesResult, messagesResult, contentTablesResult] = await Promise.all([
        supabase.from('projects').select('id, featured'),
        supabase.from('certificates').select('id'),
        supabase.from('contact_messages').select('id, name, email, message, created_at').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('id').limit(1),
      ])

      const messagesCountResult = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })

      if (cancelled) {
        return
      }

      const projects = (projectsResult.data as ProjectRow[] | null) ?? []
      const certificates = (certificatesResult.data as CertificateRow[] | null) ?? []
      const messages = (messagesResult.data as MessageRow[] | null) ?? []
      const messagesHiddenByPolicy = messages.length === 0 && (messagesCountResult.count ?? 0) === 0

      setStats({
        totalProjects: projects.length,
        featuredProjects: projects.filter((project) => Boolean(project.featured)).length,
        totalCertificates: certificates.length,
        totalMessages: messages.length,
        unreadMessages: messages.length,
      })
      setRecentMessages(messages.slice(0, 5))
      setContentAdminReady(!isMissingTableError(contentTablesResult.error))
      if (messagesResult.error) {
        setNotice({
          tone: 'warning',
          message: `Messages could not be loaded: ${messagesResult.error.message}`,
        })
      } else if (messagesHiddenByPolicy) {
        setNotice({
          tone: 'info',
          message: 'No messages are readable with the current Supabase session. If the database has messages, add this signed-in user to public.admin_profiles and run the premium CMS migration policies.',
        })
      } else {
        setNotice(null)
      }
      setLoading(false)
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const statCards = [
    {
      title: 'Projects',
      value: stats.totalProjects,
      subtitle: `${stats.featuredProjects} featured`,
      tone: 'from-slate-900 to-slate-700',
      action: () => router.push('/admin/projects'),
    },
    {
      title: 'Certificates',
      value: stats.totalCertificates,
      subtitle: 'Credentials on display',
      tone: 'from-sky-600 to-cyan-500',
      action: () => router.push('/admin/certificates'),
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      subtitle: `${stats.unreadMessages} in inbox`,
      tone: 'from-emerald-600 to-teal-500',
      action: () => router.push('/admin/messages'),
    },
    {
      title: 'Content Admin',
      value: contentAdminReady ? 'Ready' : 'Setup',
      subtitle: contentAdminReady ? 'Homepage content is editable' : 'Run the Supabase migration',
      tone: 'from-amber-500 to-orange-500',
      action: () => router.push('/admin/site-settings'),
    },
  ]

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-xl text-slate-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Admin Overview</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Everything is wired for content control</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Manage the public site, check incoming leads, and keep your portfolio presentation sharp without touching code.
        </p>
      </section>

      {!contentAdminReady ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          {getSchemaSetupMessage('The new homepage content admin')}
        </section>
      ) : null}

      {notice ? (
        <section className={`rounded-[24px] border px-5 py-4 text-sm ${
          notice.tone === 'warning'
            ? 'border-red-200 bg-red-50 text-red-800'
            : 'border-sky-200 bg-sky-50 text-sky-800'
        }`}>
          {notice.message}
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.action}
            className="group rounded-[24px] border border-black/5 bg-white p-6 text-left shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]"
          >
            <div className={`inline-flex rounded-2xl bg-gradient-to-br px-4 py-2 text-sm font-semibold text-white ${card.tone}`}>
              {card.title}
            </div>
            <div className="mt-5 text-3xl font-semibold text-slate-900">{card.value}</div>
            <p className="mt-2 text-sm text-slate-600 group-hover:text-slate-800">{card.subtitle}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quick Actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Jump into the right area</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: 'Update About Me', path: '/admin/about' },
              { label: 'Update Site Settings', path: '/admin/site-settings' },
              { label: 'Refresh Services', path: '/admin/services' },
              { label: 'Add New Project', path: '/admin/projects' },
              { label: 'Review Inbox', path: '/admin/messages' },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => router.push(item.path)}
                className="rounded-2xl border border-slate-200 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Inbox Preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent messages</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/messages')}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              View all
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => router.push('/admin/messages')}
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{message.name}</p>
                      <p className="text-sm text-slate-500">{message.email}</p>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(message.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">{message.message}</p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                No messages yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
