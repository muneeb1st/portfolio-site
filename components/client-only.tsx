'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import Image from 'next/image'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

type TiltPanelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
}

export function TiltPanel({ children, className, onPointerMove, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel, ...props }: TiltPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
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

  function resetTilt() {
    const node = ref.current
    if (!node) return

    node.style.setProperty('--rotate-x', '0deg')
    node.style.setProperty('--rotate-y', '0deg')
    node.style.setProperty('--lift', '0px')
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event)
    resetTilt()
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event)
    const node = ref.current
    if (!node) return
    node.style.setProperty('--lift', '-4px')
    node.style.setProperty('--rotate-x', '2deg')
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    onPointerUp?.(event)
    resetTilt()
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    onPointerCancel?.(event)
    resetTilt()
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-panel', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      {...props}
    >
      {children}
    </div>
  )
}

export function AmbientSpotlight() {
  return (
    <div
      className="ambient-spotlight"
      aria-hidden
    />
  )
}

function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function MotionOrchestrator() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const isTouch = isTouchDevice()

    // Cache spotlight element for pointer updates
    spotlightRef.current = document.querySelector('.ambient-spotlight')

    let raf = 0
    let isAnimating = false
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    function updateScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4))
      progressRef.current?.style.setProperty('--progress', `${progress * 100}%`)
    }

    function animate() {
      const dx = targetX - currentX
      const dy = targetY - currentY

      // Stop the loop if cursor has settled (delta < 0.5px)
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        currentX = targetX
        currentY = targetY
        const cursor = cursorRef.current
        if (cursor) {
          cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
        }
        isAnimating = false
        return
      }

      currentX += dx * 0.16
      currentY += dy * 0.16

      const cursor = cursorRef.current
      if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }

      raf = window.requestAnimationFrame(animate)
    }

    function startAnimation() {
      if (!isAnimating) {
        isAnimating = true
        raf = window.requestAnimationFrame(animate)
      }
    }

    function handlePointerMove(event: PointerEvent) {
      // Update ambient spotlight position (consolidated from separate listener)
      const spotlight = spotlightRef.current
      if (spotlight) {
        spotlight.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
        spotlight.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
      }

      // Skip cursor and magnetic effects on touch devices
      if (isTouch) return

      targetX = event.clientX
      targetY = event.clientY
      startAnimation()

      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-magnetic]') : null
      document.documentElement.classList.toggle('is-magnetic-hover', Boolean(target))

      if (target) {
        const rect = target.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        target.style.setProperty('--magnetic-x', `${x * 10}px`)
        target.style.setProperty('--magnetic-y', `${y * 8}px`)
      }
    }

    function handlePointerLeave(event: PointerEvent) {
      if (isTouch) return
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-magnetic]') : null
      if (!target) return
      target.style.setProperty('--magnetic-x', '0px')
      target.style.setProperty('--magnetic-y', '0px')
      document.documentElement.classList.remove('is-magnetic-hover')
    }

    updateScroll()

    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    if (!isTouch) {
      document.querySelectorAll('[data-magnetic]').forEach((node) => {
        node.addEventListener('pointerleave', handlePointerLeave as EventListener)
      })
    }

    return () => {
      window.cancelAnimationFrame(raf)
      isAnimating = false
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      window.removeEventListener('pointermove', handlePointerMove)
      document.querySelectorAll('[data-magnetic]').forEach((node) => {
        node.removeEventListener('pointerleave', handlePointerLeave as EventListener)
      })
      document.documentElement.classList.remove('is-magnetic-hover')
    }
  }, [])

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden />
      <div ref={cursorRef} className="cursor-orb" aria-hidden />
    </>
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
            x
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

const consoleModes = [
  {
    id: 'brand',
    label: 'Brand',
    title: 'Premium website system',
    copy: 'Positioning, page rhythm, motion, SEO, and a content model shaped into one high-trust experience.',
    metrics: ['Editorial UI', 'Conversion flow', 'CMS-ready'],
    score: '92',
  },
  {
    id: 'ai',
    label: 'AI',
    title: 'Business chatbot layer',
    copy: 'A lightweight path for future lead qualification, support answers, and business automation without rebuilding the site.',
    metrics: ['Lead capture', 'FAQ routing', 'Edge-ready'],
    score: '88',
  },
  {
    id: 'launch',
    label: 'Launch',
    title: 'Production handoff',
    copy: 'Supabase content, admin editing, responsive polish, and deployment checks packaged for a real launch.',
    metrics: ['RLS secure', 'Fast mobile', 'Deployable'],
    score: '96',
  },
]

export function StudioConsole({
  cleanName,
  profileImage,
}: {
  cleanName: string
  profileImage: string | null
}) {
  const [activeMode, setActiveMode] = useState(consoleModes[0])

  return (
    <div className="studio-console">
      <div className="studio-console__scan" aria-hidden />
      <div className="studio-console__top">
        <div>
          <p className="panel-kicker">Interactive studio console</p>
          <h2>{activeMode.title}</h2>
        </div>
        <div className="console-score" aria-label={`${activeMode.score} percent readiness`}>
          {activeMode.score}
        </div>
      </div>

      <div className="studio-console__stage">
        <div className="console-avatar">
          <Image
            src={profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=Muneeb&backgroundColor=1c1917,f5c16c'}
            alt={cleanName}
            width={260}
            height={260}
            priority
            sizes="260px"
          />
        </div>
        <div className="console-orbit" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="console-mode-grid" role="tablist" aria-label="Studio modes">
        {consoleModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={activeMode.id === mode.id}
            className={activeMode.id === mode.id ? 'is-active' : undefined}
            onClick={() => setActiveMode(mode)}
            data-magnetic
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="console-output" aria-live="polite">
        <p>{activeMode.copy}</p>
        <div className="console-meter">
          <span style={{ width: `${activeMode.score}%` }} />
        </div>
        <div className="tag-row">
          {activeMode.metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
