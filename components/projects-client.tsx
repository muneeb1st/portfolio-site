'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProjectModal } from './client-only'
import type { Project } from '@/lib/data'

export function ProjectsListClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className="work-list mt-10">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className="work-card group"
            onClick={() => setSelectedProject(project)}
            data-magnetic
          >
            <div className="work-card__media">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  width={1200}
                  height={760}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              ) : (
                <div className="work-card__placeholder">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{project.title}</strong>
                </div>
              )}
            </div>
            <div className="work-card__body">
              <p className="panel-kicker">{project.featured ? 'Featured project' : 'Selected project'}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tag-row">
                {project.technologies.slice(0, 4).map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
              <span className="work-card__link">View case notes</span>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
