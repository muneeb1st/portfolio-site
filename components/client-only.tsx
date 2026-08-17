'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ExternalLink,
  X,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Activity,
  Workflow
} from 'lucide-react'
import { sounds } from '@/lib/sound'
import type { Project } from '@/lib/data'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      baseAlpha: number
      color: string
    }

    const particles: Particle[] = []
    const particleCount = Math.min(45, Math.floor(width / 32))

    const colors = ['#f4c978', '#8fcad0', '#ffffff', '#ffd98c']

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const baseAlpha = 0.15 + Math.random() * 0.35
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 0.8,
        alpha: baseAlpha,
        baseAlpha,
        color,
      })
    }

    let mouseX = width / 2
    let mouseY = height / 3

    function handlePointerMove(e: PointerEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function handleResize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('resize', handleResize)

    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Draw subtle ambient glow near mouse
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 380)
      gradient.addColorStop(0, 'rgba(244, 201, 120, 0.05)')
      gradient.addColorStop(0.5, 'rgba(143, 202, 208, 0.03)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        p1.x += p1.vx
        p1.y += p1.vy

        if (p1.x < 0) p1.x = width
        if (p1.x > width) p1.x = 0
        if (p1.y < 0) p1.y = height
        if (p1.y > height) p1.y = 0

        // Distance to mouse for slight repulsion / aura
        const dxMouse = p1.x - mouseX
        const dyMouse = p1.y - mouseY
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 140) {
          p1.alpha = Math.min(0.8, p1.baseAlpha + (1 - distMouse / 140) * 0.5)
        } else {
          p1.alpha = p1.baseAlpha
        }

        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2)
        ctx.fillStyle = p1.color
        ctx.globalAlpha = p1.alpha
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = '#f4c978'
            ctx.globalAlpha = (1 - dist / 130) * 0.12
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-3] opacity-60"
      aria-hidden="true"
    />
  )
}

type TiltPanelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
}

export function TiltPanel({ children, className, onPointerMove, onPointerLeave, ...props }: TiltPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left) / rect.width
    const offsetY = (event.clientY - rect.top) / rect.height
    const rotateY = (offsetX - 0.5) * 8
    const rotateX = (0.5 - offsetY) * 8

    node.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`)
    node.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`)
    node.style.setProperty('--lift', '-6px')
    node.style.setProperty('--glow-x', `${(offsetX * 100).toFixed(1)}%`)
    node.style.setProperty('--glow-y', `${(offsetY * 100).toFixed(1)}%`)
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event)
    const node = ref.current
    if (!node) return
    node.style.setProperty('--rotate-x', '0deg')
    node.style.setProperty('--rotate-y', '0deg')
    node.style.setProperty('--lift', '0px')
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-panel relative group', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </div>
  )
}

export function AmbientSpotlight() {
  return <div className="ambient-spotlight" aria-hidden="true" />
}

export function MotionOrchestrator() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

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
      if (progressRef.current) {
        progressRef.current.style.setProperty('--progress', `${progress * 100}%`)
      }
    }

    function animate() {
      const dx = targetX - currentX
      const dy = targetY - currentY

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        currentX = targetX
        currentY = targetY
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
        }
        isAnimating = false
        return
      }

      currentX += dx * 0.18
      currentY += dy * 0.18

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }

      raf = window.requestAnimationFrame(animate)
    }

    function handlePointerMove(event: PointerEvent) {
      const spotlight = spotlightRef.current
      if (spotlight) {
        spotlight.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
        spotlight.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
      }

      if (isTouch) return
      targetX = event.clientX
      targetY = event.clientY
      if (!isAnimating) {
        isAnimating = true
        raf = window.requestAnimationFrame(animate)
      }
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div ref={cursorRef} className="cursor-orb" aria-hidden="true" />
    </>
  )
}

export function RevealSection({
  children,
  className,
  id,
  immediate = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  immediate?: boolean
}) {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

export function AnimatedCounter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Extract numeric portion if possible
    const match = value.match(/^(\D*)(\d+)(\D*)$/)
    if (!match) return

    const prefix = match[1] || ''
    const targetNum = parseInt(match[2], 10)
    const suffix = match[3] || ''

    let animId: number
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(ease * targetNum)
      setDisplayValue(`${prefix}${current}${suffix}`)

      if (progress < 1) {
        animId = requestAnimationFrame(step)
      } else {
        setDisplayValue(value)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animId = requestAnimationFrame(step)
        observer.disconnect()
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
      if (animId) cancelAnimationFrame(animId)
    }
  }, [value, duration])

  return <span ref={ref}>{displayValue}</span>
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!project) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  if (!project || typeof document === 'undefined') return null

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = project.demo_url || window.location.href
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      sounds.playSuccess()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return createPortal(
    <div
      className="project-modal-backdrop fixed inset-0 flex items-center justify-center bg-[#05070c]/85 p-4 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#f4c978]/30 bg-gradient-to-b from-[#181511] to-[#0a0908] p-6 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f4c978]/30 bg-[#f4c978]/10 px-3 py-0.5 text-[11px] font-mono font-bold uppercase tracking-widest text-[#ffd98c]">
              <Sparkles className="h-3 w-3" />
              {project.featured ? 'Featured Engineering Case' : 'Production Build'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#fff9ef] tracking-tight">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick()
              onClose()
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-300 hover:border-[#f4c978] hover:text-white transition-all"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Media Preview if available */}
        {project.image_url && (
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
            <Image
              src={project.image_url}
              alt={project.title}
              width={1200}
              height={700}
              className="h-auto w-full object-cover max-h-72"
            />
          </div>
        )}

        {/* Description & Case Notes */}
        <div className="mt-6 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8fcad0]">
            System Overview & Architecture
          </h4>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">{project.description}</p>
        </div>

        {/* Tech Stack Matrix */}
        <div className="mt-6 space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
            Engineered With
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#ffd98c]"
              >
                <Cpu className="h-3 w-3 text-[#8fcad0]" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target={project.demo_url.startsWith('#') ? undefined : '_blank'}
              rel={project.demo_url.startsWith('#') ? undefined : 'noreferrer'}
              onClick={() => sounds.playClick()}
              className="flex items-center gap-2 rounded-full border border-[#f4c978] bg-gradient-to-r from-[#f6d58c] to-[#c9943c] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#161108] shadow-[0_0_25px_rgba(244,201,120,0.35)] hover:scale-105 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Launch Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-stone-200 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              <Code2 className="h-4 w-4" />
              Source Repository
            </a>
          )}
          <button
            type="button"
            onClick={copyShareLink}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-stone-400 hover:text-stone-200 transition-all ml-auto"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Link Copied!' : 'Share Project'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// -------------------------------------------------------------
// Interactive Studio Console (Next-Level Live System Playground)
// -------------------------------------------------------------

const studioTabs = [
  {
    id: 'architecture',
    label: 'Live Stack Flow',
    icon: Workflow,
    title: 'Full-Stack Architecture Matrix',
    copy: 'Production Next.js 15 App Router orchestrated with Supabase PostgreSQL, Gemini AI agent pipelines, and edge-cached dynamic rendering.',
    metricName: 'Lighthouse / Performance',
    metricVal: '99',
  },
  {
    id: 'terminal',
    label: 'AI Route Terminal',
    icon: Terminal,
    title: 'Server-Side AI Dispatcher',
    copy: 'Deterministic TypeScript agent runtime utilizing Gemini 3.5 & Mistral APIs with automatic schema validation and zero client-key leaks.',
    metricName: 'Agent Response Latency',
    metricVal: '< 240ms',
  },
  {
    id: 'profile',
    label: 'Engineer Profile',
    icon: Layers,
    title: 'Muneeb Ur Rehman',
    copy: 'CS student, relentless builder, full-stack engineer creating high-converting websites, autonomous AI assistants, and rock-solid systems.',
    metricName: 'Production Readiness',
    metricVal: '100%',
  },
]

export function StudioConsole({
  cleanName,
  profileImage,
}: {
  cleanName: string
  profileImage: string | null
}) {
  const [activeTab, setActiveTab] = useState(studioTabs[0].id)
  const [codeCopied, setCodeCopied] = useState(false)
  const [testOutput, setTestOutput] = useState<string | null>(null)
  const [isRunningCode, setIsRunningCode] = useState(false)

  const currentTab = studioTabs.find((t) => t.id === activeTab) || studioTabs[0]

  const codeSnippet = `// app/api/pipeline/agent.ts
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const { prompt, context } = await req.json();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const result = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: \`Context: \${context}\\nTask: \${prompt}\`,
  });

  return Response.json({ success: true, payload: result.text });
}`

  const handleRunSimulator = () => {
    sounds.playClick()
    setIsRunningCode(true)
    setTestOutput('Dispatching Gemini API inference pipeline...')
    setTimeout(() => {
      sounds.playSuccess()
      setIsRunningCode(false)
      setTestOutput('✓ 200 OK — Pipeline executed in 118ms with 0 errors.')
    }, 900)
  }

  const handleCopyCode = () => {
    sounds.playClick()
    navigator.clipboard.writeText(codeSnippet)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#f4c978]/30 bg-gradient-to-br from-[#1b1712]/95 via-[#120f0c]/90 to-[#080706] p-5 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Decorative Aura / Scanner */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#f4c978]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#8fcad0]/15 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#ffd98c] uppercase">
            Interactive Studio Console
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-mono text-stone-300">
          <Activity className="h-3 w-3 text-[#8fcad0]" />
          <span>SYS: ONLINE</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {studioTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick()
                setActiveTab(tab.id)
              }}
              onMouseEnter={() => sounds.playHover()}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all ${
                isActive
                  ? 'border border-[#f4c978]/50 bg-gradient-to-r from-[#f4c978]/20 to-[#8fcad0]/10 text-[#ffd98c] shadow-[0_0_15px_rgba(244,201,120,0.2)]'
                  : 'border border-white/5 bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#f4c978]' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === 'architecture' ? 'Flow' : tab.id === 'terminal' ? 'Code' : 'Bio'}</span>
            </button>
          )
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-5 min-h-[17rem]">
        {/* Tab 1: Flow / Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="rounded-xl border border-[#f4c978]/40 bg-[#f4c978]/10 p-2.5">
                  <span className="block text-[10px] text-stone-400">01. CLIENT</span>
                  <strong className="text-[#ffd98c]">React 19</strong>
                </div>
                <div className="rounded-xl border border-[#8fcad0]/40 bg-[#8fcad0]/10 p-2.5">
                  <span className="block text-[10px] text-stone-400">02. CORE</span>
                  <strong className="text-[#8fcad0]">Next.js 15</strong>
                </div>
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5">
                  <span className="block text-[10px] text-stone-400">03. DATA</span>
                  <strong className="text-emerald-300">Supabase</strong>
                </div>
                <div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-2.5">
                  <span className="block text-[10px] text-stone-400">04. AI</span>
                  <strong className="text-purple-300">Gemini 3.5</strong>
                </div>
              </div>

              {/* Animated Signal Pipeline */}
              <div className="mt-4 flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 text-[11px] font-mono text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#f4c978] animate-bounce" />
                  Edge Latency: <strong className="text-white">18ms</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Security: <strong className="text-white">Strict Role Auth</strong>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{currentTab.copy}</p>
          </div>
        )}

        {/* Tab 2: Terminal / Code */}
        {activeTab === 'terminal' && (
          <div className="space-y-3 animate-fade-in">
            <div className="relative rounded-2xl border border-white/10 bg-[#070605] p-3.5 font-mono text-[11px] text-stone-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[10px] text-stone-500">pipeline/agent.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunSimulator}
                    disabled={isRunningCode}
                    className="flex items-center gap-1 rounded bg-[#f4c978]/20 px-2 py-0.5 text-[10px] font-bold text-[#ffd98c] hover:bg-[#f4c978]/30 transition"
                  >
                    <Play className="h-2.5 w-2.5" />
                    {isRunningCode ? 'Running...' : 'Simulate API'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-stone-400 hover:text-white"
                    title="Copy code"
                  >
                    {codeCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto text-[11px] leading-relaxed text-amber-200/90 max-h-36">
                <code>{codeSnippet}</code>
              </pre>

              {testOutput && (
                <div className="mt-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-[10px] text-emerald-300 font-mono">
                  {testOutput}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profile & Photo */}
        {activeTab === 'profile' && (
          <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in">
            <div className="relative flex-shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#f4c978] shadow-[0_0_30px_rgba(244,201,120,0.3)]">
                <Image
                  src={profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=Muneeb&backgroundColor=1c1917,f5c16c'}
                  alt={cleanName}
                  width={140}
                  height={140}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#080706] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-display text-xl font-bold text-[#fff9ef]">{cleanName}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{currentTab.copy}</p>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-[#8fcad0]">
                  CS Student
                </span>
                <span className="rounded-full bg-[#f4c978]/10 border border-[#f4c978]/20 px-2.5 py-0.5 text-[10px] font-mono text-[#ffd98c]">
                  Open for Freelance & Roles
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics Indicator */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-mono">
        <span className="text-stone-400">{currentTab.metricName}</span>
        <strong className="text-[#ffd98c] text-sm">{currentTab.metricVal}</strong>
      </div>
    </div>
  )
}
