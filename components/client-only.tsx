'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function TiltPanel({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left) / rect.width
    const offsetY = (event.clientY - rect.top) / rect.height
    const rotateY = (offsetX - 0.5) * 10
    const rotateX = (0.5 - offsetY) * 10

    node.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`)
    node.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`)
    node.style.setProperty('--lift', '-6px')
  }

  function handlePointerLeave() {
    const node = ref.current
    if (!node) return

    node.style.setProperty('--rotate-x', '0deg')
    node.style.setProperty('--rotate-y', '0deg')
    node.style.setProperty('--lift', '0px')
  }

  function handlePointerDown() {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--lift', '-4px')
    node.style.setProperty('--rotate-x', '2deg')
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-panel', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      style={style}
    >
      {children}
    </div>
  )
}

export function AmbientSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const isClient = typeof window !== 'undefined'

  useEffect(() => {
    if (!isClient) return

    function handleMove(event: PointerEvent) {
      const node = ref.current
      if (!node) return

      node.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
      node.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [isClient])

  return (
    <div
      ref={ref}
      className="ambient-spotlight"
      aria-hidden
    />
  )
}

export function RevealSection({ children, className, id, immediate = false }: { children: ReactNode; className?: string; id?: string; immediate?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -100px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [immediate])

  return (
    <div id={id} ref={ref} className={cn('reveal', isVisible && 'is-visible', className)}>
      {children}
    </div>
  )
}

export function ProjectModal({ project, onClose }: { project: import('@/lib/data').Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/80 p-4 backdrop-blur-xl"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] p-7 md:p-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="eyebrow">Project spotlight</div>
            <h2 id="project-modal-title" className="font-display mt-5 text-4xl text-[#fff7ec] md:text-5xl">
              {project.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition hover:border-white/20 hover:text-white" aria-label="Close project dialog">
            ×
          </button>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{project.description}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.technologies.map((technology) => (
            <span key={technology} className="offer-chip">{technology}</span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {project.demo_url && (
            <a href={project.demo_url} className="glow-button inline-flex" target={project.demo_url.startsWith('#') ? undefined : '_blank'} rel={project.demo_url.startsWith('#') ? undefined : 'noreferrer'}>
              View demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="ghost-button inline-flex">View code</a>
          )}
        </div>
      </div>
    </div>
  )
}