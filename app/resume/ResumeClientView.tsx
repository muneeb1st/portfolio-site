'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Code2, 
  Layers, 
  Mail, 
  Globe, 
  Calendar
} from 'lucide-react'
import type { fetchAllPortfolioData } from '@/lib/data'

type PortfolioData = Awaited<ReturnType<typeof fetchAllPortfolioData>>

export function ResumeClientView({ data }: { data: PortfolioData }) {
  const { about, projects, certificates, skillCategories, heroStats } = data
  const [downloading, setDownloading] = useState(false)

  const handlePrintOrDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 150)
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-stone-100 py-6 sm:py-12 px-3 sm:px-6 print:bg-white print:text-black print:p-0">
      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-mono font-medium text-stone-300 hover:border-white/30 hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrintOrDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-[#ffd98c]/40 bg-[#ffd98c] px-4 py-2 text-xs font-mono font-bold text-black shadow-[0_0_20px_rgba(255,217,140,0.25)] hover:bg-[#ffe1a6] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Preparing...' : 'Download / Save PDF'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono font-medium text-stone-200 hover:border-white/30 hover:text-white transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Resume Canvas */}
      <main className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#12151d] via-[#0e1017] to-[#0a0c10] p-6 sm:p-10 md:p-14 shadow-2xl backdrop-blur-2xl print:border-none print:bg-white print:text-black print:p-6 print:shadow-none print:rounded-none">
        {/* Header Section */}
        <header className="border-b border-white/10 pb-8 print:border-stone-300 print:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white print:text-black">
                {about.name || 'Muneeb Ur Rehman'}
              </h1>
              <p className="mt-2 text-sm sm:text-base font-mono font-semibold text-[#ffd98c] print:text-stone-800">
                {about.tagline || 'Full-Stack Developer & AI Automation Engineer'}
              </p>
            </div>

            {/* Contact metadata */}
            <div className="flex flex-col gap-1.5 text-xs font-mono text-stone-300 print:text-stone-700">
              {about.email && (
                <a href={`mailto:${about.email}`} className="flex items-center gap-1.5 hover:text-[#ffd98c] print:text-black">
                  <Mail className="h-3.5 w-3.5 text-[#ffd98c] print:hidden" />
                  <span>{about.email}</span>
                </a>
              )}
              {about.github_url && (
                <a href={about.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#ffd98c] print:text-black">
                  <Code2 className="h-3.5 w-3.5 text-[#ffd98c] print:hidden" />
                  <span>{about.github_url.replace('https://', '')}</span>
                </a>
              )}
              {about.linkedin_url && (
                <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#ffd98c] print:text-black">
                  <Globe className="h-3.5 w-3.5 text-[#ffd98c] print:hidden" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              <span className="flex items-center gap-1.5 text-emerald-400 print:text-stone-600">
                <CheckCircle2 className="h-3.5 w-3.5 print:hidden" />
                <span>Available for Full-Stack &amp; AI Builds</span>
              </span>
            </div>
          </div>

          {/* Bio Summary */}
          {about.bio && (
            <p className="mt-5 text-xs sm:text-sm text-stone-300/90 leading-relaxed print:text-stone-800">
              {about.bio}
            </p>
          )}

          {/* Quick Metrics Bar */}
          {heroStats && heroStats.length > 0 && (
            <div className={`grid gap-2.5 mt-6 pt-5 border-t border-white/5 print:border-stone-200 ${
              heroStats.length === 1
                ? 'grid-cols-1 max-w-xs mx-auto'
                : heroStats.length === 2
                  ? 'grid-cols-2 max-w-md mx-auto'
                  : heroStats.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-4'
            }`}>
              {heroStats.map(stat => (
                <div key={stat.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center print:border-stone-200 print:bg-transparent">
                  <strong className="block font-display text-lg font-bold text-[#ffd98c] print:text-black">
                    {stat.value}
                  </strong>
                  <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider print:text-stone-600">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Technical Skills & Specializations */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffd98c] font-bold mb-4 print:text-black print:border-b print:border-stone-300 print:pb-1">
            <Layers className="h-4 w-4 print:hidden" />
            <span>Technical Skills &amp; Architecture</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillCategories.map(cat => (
              <div key={cat.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 print:border-stone-200 print:bg-transparent">
                <h3 className="text-xs font-mono font-bold text-white mb-2 print:text-black">
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map(skill => (
                    <span key={skill} className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-stone-300 print:border-stone-300 print:bg-stone-100 print:text-black">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section (Live from Database) */}
        <section className="mt-9">
          <div className="flex items-center justify-between mb-4 print:border-b print:border-stone-300 print:pb-1">
            <h2 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffd98c] font-bold print:text-black">
              <Code2 className="h-4 w-4 print:hidden" />
              <span>Shipped Projects ({projects.length})</span>
            </h2>
            <span className="text-[10px] font-mono text-stone-500 print:hidden">Auto-synced from Database</span>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 print:border-stone-200 print:bg-transparent print:p-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-white print:text-black">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#ffd98c]/30 bg-[#ffd98c]/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#ffd98c] print:border-stone-300 print:text-black">
                        <Sparkles className="h-2.5 w-2.5 print:hidden" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 text-xs font-mono text-[#ffd98c] print:text-stone-700">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3 print:hidden" />
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-stone-400 hover:text-white print:text-stone-600">
                        <span>Code</span>
                        <ExternalLink className="h-3 w-3 print:hidden" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-3 print:text-stone-800">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map(t => (
                      <span key={t} className="rounded bg-black/40 border border-white/5 px-2 py-0.5 text-[10px] font-mono text-stone-400 print:bg-stone-100 print:border-stone-300 print:text-black">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Verified Credentials & Certificates (Live from Database) */}
        {certificates && certificates.length > 0 && (
          <section className="mt-9">
            <div className="flex items-center justify-between mb-4 print:border-b print:border-stone-300 print:pb-1">
              <h2 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffd98c] font-bold print:text-black">
                <Award className="h-4 w-4 print:hidden" />
                <span>Certificates &amp; Credentials ({certificates.length})</span>
              </h2>
              <span className="text-[10px] font-mono text-stone-500 print:hidden">Auto-synced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between print:border-stone-200 print:bg-transparent">
                  <div>
                    <h3 className="font-display text-sm font-bold text-white print:text-black">{cert.title}</h3>
                    <p className="text-xs font-mono text-stone-400 mt-1 print:text-stone-700">{cert.issuer}</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-stone-500 print:border-stone-200 print:text-stone-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {cert.issue_date}
                    </span>
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-[#ffd98c] hover:underline flex items-center gap-0.5 print:text-black">
                        <span>Verify</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Background */}
        <section className="mt-9">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#ffd98c] font-bold mb-3 print:text-black print:border-b print:border-stone-300 print:pb-1">
            Education
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 print:border-stone-200 print:bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-display text-sm font-bold text-white print:text-black">
                Bachelor of Science in Computer Science (BS CS)
              </h3>
              <span className="text-xs font-mono text-stone-400 print:text-stone-600">
                NFC-IET, Multan, Pakistan
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono mt-1 print:text-stone-700">
              Focus on distributed systems, modern web engineering, algorithms, and applied machine learning workflows.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
