'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProjectModal, TiltPanel } from './client-only'
import type { Project } from '@/lib/data'

function accentStyle(accent: string): React.CSSProperties {
  return { ['--card-accent' as string]: accent } as React.CSSProperties
}

export function ProjectsListClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <TiltPanel 
            key={project.id} 
            className="package-card group h-full rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 md:p-6 cursor-pointer" 
            style={accentStyle(index === 0 ? '247, 178, 77' : index === 1 ? '93, 226, 231' : '255, 122, 89')}
            onClick={() => setSelectedProject(project)}
          >
            <div className="overflow-hidden rounded-[1.2rem] sm:rounded-[1.4rem] border border-white/10 bg-black/20">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  width={1200}
                  height={760}
                  className="h-48 sm:h-64 w-full object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-48 sm:h-64 flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,rgba(247,178,77,0.22),rgba(93,226,231,0.12)_50%,rgba(255,122,89,0.14))] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="offer-chip">Live project</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-white/45">0{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl text-[#fff7ec]">{project.title}</div>
                    <div className="mt-2 sm:mt-3 max-w-xs text-xs sm:text-sm leading-5 sm:leading-6 text-white/68">Built and shipped — click for details.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-6">
              <div className="text-xs uppercase tracking-[0.24em] text-white/38">
                {project.featured ? 'Featured project' : 'Showcase project'}
              </div>
              <h3 className="font-display mt-2 sm:mt-3 text-2xl sm:text-3xl text-[#fff7ec]">{project.title}</h3>
              <p className="mt-3 sm:mt-4 line-clamp-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/60">{project.description}</p>
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((technology) => (
                  <span key={technology} className="offer-chip">{technology}</span>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 text-xs sm:text-sm uppercase tracking-[0.24em] text-[#5de2e7] group-hover:text-white transition">View details →</div>
            </div>
          </TiltPanel>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
