'use client'

import { useState } from 'react'
import { 
  Terminal, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  ShieldCheck, 
  Activity, 
  Workflow,
  Code2,
  Radio
} from 'lucide-react'
import Image from 'next/image'
import { sounds } from '@/lib/sound'

interface ModeConfig {
  id: string
  label: string
  icon: typeof Terminal
  tag: string
  title: string
  status: string
  command: string
  logs: string[]
  metrics: { label: string; val: string; sub: string }[]
  nodes: { label: string; status: 'online' | 'syncing' | 'ready'; speed: string }[]
  specs: { k: string; v: string }[]
}

const CONSOLE_MODES: ModeConfig[] = [
  {
    id: 'interactive',
    label: 'Interactive Terminal',
    icon: Terminal,
    tag: 'SYSTEM LIVE // ACTIVE',
    title: 'Autonomous System Shell',
    status: '0.04ms latency // Ready',
    command: 'npx muneeb-cli --inspect --realtime',
    logs: [
      '● [KERNEL] Initializing full-stack reactive sandbox...',
      '✓ [SUPABASE] Real-time persistence channels synchronized',
      '✓ [GEMINI] Context pipeline active (Neural weights loaded)',
      '✓ [RENDER] Turbopack GPU accelerated frame-buffer ready',
      '▶ System operational. Type or click any node to interact.'
    ],
    metrics: [
      { label: 'Uptime', val: '99.98%', sub: 'Zero cold-start' },
      { label: 'Speed Index', val: '0.4s', sub: 'Lighthouse 100' },
      { label: 'Integrations', val: '14+', sub: 'APIs & Webhooks' }
    ],
    nodes: [
      { label: 'Next.js 15', status: 'online', speed: '12ms' },
      { label: 'Supabase DB', status: 'online', speed: '24ms' },
      { label: 'Gemini AI', status: 'ready', speed: '85ms' },
      { label: 'Tailwind CSS', status: 'online', speed: '0ms' }
    ],
    specs: [
      { k: 'Frontend', v: 'Next.js 15' },
      { k: 'Database', v: 'Supabase' },
      { k: 'AI Engine', v: 'Gemini 2.5' },
      { k: 'Security', v: 'RLS Auth' }
    ]
  },
  {
    id: 'ai',
    label: 'AI Automation & Agents',
    icon: Sparkles,
    tag: 'NEURAL WORKFLOWS // ACTIVE',
    title: 'AI Automation Pipelines',
    status: 'Autonomous Reasoning // Live',
    command: 'gemini.agent.synthesize({ domain: "business-logic" })',
    logs: [
      '● [AGENT] Ingesting client interaction intent...',
      '✓ [ROUTER] Categorized: High-intent enterprise lead',
      '✓ [SYNAPSE] Context grounding via verified portfolio vector',
      '✓ [STREAM] Generated personalized implementation proposal',
      '▶ Dispatching live webhook to admin notifications queue.'
    ],
    metrics: [
      { label: 'Inference', val: '<120ms', sub: 'Streaming token' },
      { label: 'Accuracy', val: '98.6%', sub: 'Grounded facts' },
      { label: 'Cost/Req', val: '$0.000', sub: 'Optimized tokens' }
    ],
    nodes: [
      { label: 'Intent Parser', status: 'online', speed: '18ms' },
      { label: 'Vector Store', status: 'online', speed: '32ms' },
      { label: 'Gemini LLM', status: 'online', speed: '8ms' },
      { label: 'Action Agent', status: 'ready', speed: '44ms' }
    ],
    specs: [
      { k: 'LLM Core', v: 'Gemini 2.5' },
      { k: 'Workflow', v: 'B.L.A.S.T.' },
      { k: 'Format', v: 'JSON-Schema' },
      { k: 'Fail-Safe', v: 'Self-Heal' }
    ]
  },
  {
    id: 'architecture',
    label: 'Production Architecture',
    icon: Workflow,
    tag: 'ENTERPRISE STACK // SCALED',
    title: 'High-Conversion Architecture',
    status: 'Distributed // Resilient',
    command: 'deploy.verify({ target: "cloud-run", rls: true })',
    logs: [
      '● [SECURITY] Auditing Row-Level-Security (RLS) policies...',
      '✓ [DATABASE] 0 unsecured tables detected, SSL enforced',
      '✓ [CDN] Global edge caching enabled across 280+ POPs',
      '✓ [SEO/A11Y] Semantic HTML5, Schema.org metadata verified',
      '▶ Enterprise deployment verified for high-volume conversion.'
    ],
    metrics: [
      { label: 'Load Time', val: '310ms', sub: 'Global p95' },
      { label: 'Conversion', val: '3.4x', sub: 'Benchmark' },
      { label: 'Type Safety', val: '100%', sub: 'Strict TS / Zod' }
    ],
    nodes: [
      { label: 'Vercel Edge', status: 'online', speed: '4ms' },
      { label: 'Supabase RLS', status: 'online', speed: '16ms' },
      { label: 'Web Audio', status: 'online', speed: '0ms' },
      { label: 'Analytics', status: 'online', speed: '19ms' }
    ],
    specs: [
      { k: 'Stack', v: 'Next.js 15' },
      { k: 'Styling', v: 'Tailwind 4' },
      { k: 'Audio', v: 'Web Audio' },
      { k: 'Deploy', v: 'Cloud Edge' }
    ]
  }
]

export function NextGenStudioConsole({
  cleanName,
  profileImage
}: {
  cleanName: string
  profileImage: string | null
}) {
  const [activeTab, setActiveTab] = useState<string>('interactive')
  const [copied, setCopied] = useState(false)
  const [inputCmd, setInputCmd] = useState('')
  const [customLogs, setCustomLogs] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isPinging, setIsPinging] = useState(false)
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null)

  const currentMode = CONSOLE_MODES.find(m => m.id === activeTab) || CONSOLE_MODES[0]

  const handleTabChange = (modeId: string) => {
    sounds.playTab()
    setActiveTab(modeId)
    setCustomLogs([])
  }

  const handleCopyCmd = () => {
    sounds.playSuccess()
    navigator.clipboard.writeText(currentMode.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCmd.trim()) return

    sounds.playClick()
    const raw = inputCmd.trim().toLowerCase()
    setInputCmd('')

    let reply = `➜ ${raw}: command acknowledged.`
    if (raw.includes('help')) {
      reply = 'Available commands: projects, stack, hire, clear, status, ping, audio'
    } else if (raw.includes('projects') || raw.includes('work')) {
      reply = '▶ Navigating to #work projects section...'
      window.location.hash = 'work'
    } else if (raw.includes('stack')) {
      reply = '⚡ Core Stack: Next.js 15, TypeScript, Tailwind CSS, Supabase, Gemini AI, Web Audio.'
    } else if (raw.includes('hire') || raw.includes('contact')) {
      reply = '✉ Dispatching to #contact form...'
      window.location.hash = 'contact'
    } else if (raw.includes('clear')) {
      setCustomLogs([])
      return
    } else if (raw.includes('ping')) {
      setIsPinging(true)
      sounds.playSuccess()
      reply = `✓ Ping: 18ms latency to global edge node. Status: OPTIMAL`
      setTimeout(() => setIsPinging(false), 1200)
    } else if (raw.includes('audio') || raw.includes('sound')) {
      const next = !soundEnabled
      setSoundEnabled(next)
      sounds.toggleSound()
      reply = `Audio synth feedback: ${next ? 'ENABLED' : 'MUTED'}`
    } else {
      reply = `⚡ Executed "${raw}": System nominal. Type "help" for options.`
    }

    setCustomLogs(prev => [...prev, `➜ user: ${raw}`, reply])
  }

  const handleNodeClick = (index: number, node: { label: string; speed: string }) => {
    sounds.playHover()
    setActiveNodeIndex(index)
    setCustomLogs(prev => [
      ...prev,
      `● [TELEMETRY] ${node.label} pinged: response ${node.speed} (Healthy)`
    ])
    setTimeout(() => setActiveNodeIndex(null), 1500)
  }

  return (
    <div 
      id="interactive-console"
      className="relative rounded-3xl border border-[#ffd98c]/25 bg-gradient-to-b from-[#12151d]/95 via-[#0d1017]/95 to-[#080a0f]/98 p-5 md:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(255,217,140,0.06)] backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:border-[#ffd98c]/40 group"
    >
      {/* Decorative scan beam & grid lighting */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#ffd98c]/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#8fcad0]/10 blur-[90px]" />
      
      {/* CRT Scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] opacity-70" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
          <div className="h-4 w-px bg-white/15 mx-1" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#ffd98c] flex items-center gap-1.5">
            <Radio className="h-3 w-3 animate-pulse text-[#ffd98c]" />
            {currentMode.tag}
          </span>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-stone-300">
          <span className={`h-2 w-2 rounded-full ${isPinging ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span>{currentMode.status}</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 sm:gap-2 mt-4 p-1 sm:p-1.5 rounded-2xl bg-black/40 border border-white/5">
        {CONSOLE_MODES.map((mode) => {
          const Icon = mode.icon
          const isActive = activeTab === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => handleTabChange(mode.id)}
              className={`flex items-center justify-center gap-1 sm:gap-2 rounded-xl py-2 px-1.5 sm:px-3 text-[11px] sm:text-xs font-semibold tracking-wide transition-all whitespace-nowrap overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#ffd98c]/20 to-[#ffd98c]/10 text-[#ffd98c] border border-[#ffd98c]/40 shadow-[0_0_20px_rgba(255,217,140,0.15)]'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ${isActive ? 'text-[#ffd98c]' : 'text-stone-400'}`} />
              <span className="truncate">
                {mode.id === 'interactive' ? 'Terminal' : mode.id === 'ai' ? 'AI Auto' : 'Stack'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Sandbox Stage: High-Res Developer Avatar + Live Telemetry Nodes */}
      <div className="relative z-10 my-4 sm:my-5 rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          
          {/* High-Resolution Avatar Node */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulse & Kinetic Orbit Rings */}
              <div className="absolute h-36 w-36 rounded-full border border-[#ffd98c]/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute h-32 w-32 rounded-full border border-[#8fcad0]/30 animate-spin [animation-duration:14s]" />
              <div className="absolute h-28 w-28 rounded-full border border-dashed border-[#ffd98c]/40 animate-spin [animation-duration:8s] [animation-direction:reverse]" />

              {/* Balanced Avatar Container with natural smoothing */}
              <div className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border border-[#ffd98c]/60 shadow-[0_0_20px_rgba(255,217,140,0.2)] bg-gradient-to-b from-stone-800 to-stone-950">
                <Image
                  src={profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=Muneeb&backgroundColor=1c1917,f5c16c'}
                  alt={cleanName}
                  width={140}
                  height={140}
                  priority
                  className="h-full w-full object-cover [image-rendering:auto] contrast-[0.96] brightness-[0.98]"
                />
                {/* Natural soft vignette overlay to eliminate artificial jagged edges */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-white/5" />
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <span className="text-xs font-mono font-bold text-white tracking-wider flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {cleanName}
              </span>
              <span className="text-[10px] font-mono text-stone-400 block">
                Full-Stack &amp; AI Architect
              </span>
            </div>
          </div>

          {/* Interactive Node Matrix & Specs */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-stone-400 mb-0.5">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Activity className="h-3.5 w-3.5 text-[#ffd98c]" />
                Live Architecture
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nominal
              </span>
            </div>

            {/* 2x2 Telemetry Node Cards */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {currentMode.nodes.map((node, i) => (
                <button
                  key={node.label}
                  onClick={() => handleNodeClick(i, node)}
                  className={`flex items-center justify-between rounded-xl border p-2 text-left transition-all ${
                    activeNodeIndex === i
                      ? 'border-[#ffd98c] bg-[#ffd98c]/15 shadow-[0_0_15px_rgba(255,217,140,0.3)]'
                      : 'border-white/10 bg-white/5 hover:border-[#ffd98c]/40 hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <span className="block text-[11px] sm:text-xs font-mono font-semibold text-stone-200 whitespace-nowrap">
                      {node.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {node.status}
                    </span>
                  </div>
                  <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-[#ffd98c] shrink-0">
                    {node.speed}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Architecture Specs Bar */}
            <div className="grid grid-cols-4 gap-1 mt-1 border-t border-white/10 pt-2 text-center">
              {currentMode.specs.map(spec => (
                <div key={spec.k} className="rounded-lg bg-white/5 p-1">
                  <span className="block text-[8px] sm:text-[9px] font-mono uppercase text-stone-400">{spec.k}</span>
                  <span className="block text-[10px] sm:text-[11px] font-mono font-bold text-stone-200 whitespace-nowrap">{spec.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metric Counters */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 mb-4">
        {currentMode.metrics.map(metric => (
          <div key={metric.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <strong className="block font-display text-lg md:text-xl text-[#ffd98c] tracking-tight">
              {metric.val}
            </strong>
            <span className="block text-xs font-mono font-semibold text-stone-200 mt-0.5">
              {metric.label}
            </span>
            <span className="block text-[10px] font-mono text-stone-400">
              {metric.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Live Stream Logs Box */}
      <div className="relative z-10 rounded-xl border border-white/10 bg-black/70 p-3.5 font-mono text-xs text-stone-300">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <Code2 className="h-3.5 w-3.5 text-[#ffd98c]" />
            <span>Execution Terminal Stream</span>
          </div>
          <button
            onClick={handleCopyCmd}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-[#ffd98c] transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy CLI'}</span>
          </button>
        </div>

        <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-[11px] leading-relaxed">
          {currentMode.logs.map((log, i) => (
            <p key={i} className={log.includes('✓') ? 'text-emerald-400' : log.includes('▶') ? 'text-[#ffd98c]' : 'text-stone-300'}>
              {log}
            </p>
          ))}
          {customLogs.map((log, i) => (
            <p key={`custom-${i}`} className="text-cyan-300">
              {log}
            </p>
          ))}
        </div>

        {/* Interactive CLI Input Form */}
        <form onSubmit={handleRunCommand} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2">
          <span className="text-[#ffd98c] font-bold">➜</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Type 'help', 'projects', 'stack', 'ping'..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg border border-[#ffd98c]/30 bg-[#ffd98c]/10 px-2.5 py-1 text-[11px] font-mono font-bold text-[#ffd98c] hover:bg-[#ffd98c]/20 transition-all"
          >
            <Play className="h-3 w-3" /> Run
          </button>
        </form>
      </div>

      {/* Quick Action Footer */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-stone-400">Available for select client builds</span>
        </div>

        <a 
          href="#contact" 
          onClick={() => sounds.playClick()}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ffd98c] hover:underline"
        >
          <span>Initiate Project Scope</span>
          <span className="text-sm">→</span>
        </a>
      </div>
    </div>
  )
}
