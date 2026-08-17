'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Code2, Sparkles, Search, ArrowUpRight, Layers } from 'lucide-react'
import { ProjectModal } from './client-only'
import { sounds } from '@/lib/sound'
import type { Project } from '@/lib/data'

export function ProjectsListClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Extract unique technology tags
  const allTechs = useMemo(() => {
    const set = new Set<string>()
    projects.forEach(p => p.technologies?.forEach(t => set.add(t)))
    return Array.from(set).slice(0, 6)
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'all' 
        ? true 
        : activeFilter === 'featured' 
          ? p.featured 
          : p.technologies?.some(t => t.toLowerCase() === activeFilter.toLowerCase())

      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesFilter && matchesSearch
    })
  }, [projects, activeFilter, searchQuery])

  return (
    <div className="mt-8 space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by stack, feature, architecture..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-xs font-mono text-white placeholder:text-stone-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 px-2">
          <button
            onClick={() => {
              sounds.playTab()
              setActiveFilter('all')
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-[#ffd98c] !text-[#080706] shadow-[0_0_15px_rgba(255,217,140,0.35)] border border-[#ffd98c]'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => {
              sounds.playTab()
              setActiveFilter('featured')
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1 ${
              activeFilter === 'featured'
                ? 'bg-[#ffd98c] !text-[#080706] shadow-[0_0_15px_rgba(255,217,140,0.35)] border border-[#ffd98c]'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Sparkles className={`h-3 w-3 ${activeFilter === 'featured' ? '!text-[#080706]' : 'text-stone-400'}`} />
            Featured
          </button>
          {allTechs.map(tech => (
            <button
              key={tech}
              onClick={() => {
                sounds.playTab()
                setActiveFilter(tech)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                activeFilter === tech
                  ? 'bg-[#ffd98c] !text-[#080706] shadow-[0_0_15px_rgba(255,217,140,0.35)] border border-[#ffd98c]'
                  : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 3D Perspective Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => (
          <article
            key={project.id}
            className="group relative flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#141822]/90 to-[#0a0d14]/95 p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-[#ffd98c]/40 hover:shadow-[0_25px_60px_rgba(255,217,140,0.08)] hover:-translate-y-1.5"
          >
            {/* Top Accent & Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#ffd98c]">
                  PROJ // {String(index + 1).padStart(2, '0')}
                </span>
                {project.featured && (
                  <span className="flex items-center gap-1 rounded-full bg-[#ffd98c]/15 border border-[#ffd98c]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ffd98c]">
                    <Sparkles className="h-2.5 w-2.5" />
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Build
              </div>
            </div>

            {/* Media Image Container with Zoom & Scan Overlay */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-stone-900 mb-5">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-900 via-stone-950 to-black p-6 text-center">
                  <div className="space-y-2">
                    <Layers className="h-8 w-8 text-[#ffd98c] mx-auto opacity-70" />
                    <strong className="block font-display text-lg text-white">{project.title}</strong>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Project Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#ffd98c] transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300/80 line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Technologies Tag Row */}
              <div className="mt-5">
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies?.map((tech) => (
                    <span 
                      key={tech}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-stone-300 group-hover:border-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target={project.demo_url.startsWith('#') ? undefined : '_blank'}
                        rel={project.demo_url.startsWith('#') ? undefined : 'noreferrer'}
                        onClick={() => sounds.playClick()}
                        className="flex items-center gap-1.5 rounded-full border border-[#ffd98c]/50 bg-gradient-to-r from-[#ffd98c] via-[#f5c76d] to-[#e5b358] px-4 py-2 text-xs font-mono font-bold !text-[#080706] shadow-[0_0_15px_rgba(255,217,140,0.25)] hover:shadow-[0_0_20px_rgba(255,217,140,0.4)] hover:scale-105 transition-all"
                      >
                        <span className="font-bold !text-[#080706]">Demo</span>
                        <ArrowUpRight className="h-3.5 w-3.5 !text-[#080706]" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sounds.playClick()}
                        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono font-semibold text-stone-200 hover:border-[#ffd98c]/40 hover:bg-white/10 hover:text-white transition-all"
                      >
                        <Code2 className="h-3.5 w-3.5 text-[#8fcad0]" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playModal()
                      setSelectedProject(project)
                    }}
                    className="text-xs font-mono font-semibold text-stone-300 hover:text-[#ffd98c] underline underline-offset-4 transition-colors"
                  >
                    Specs &amp; Case Notes
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}
