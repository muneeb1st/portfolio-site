'use client'

import Image from 'next/image'
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'

interface ProjectRow {
  id: string
  title: string
  description: string
  technologies: unknown
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  featured: boolean | null
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  featured: boolean
}

interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url: string | null
}

interface AboutData {
  name: string | null
  tagline: string | null
  bio: string | null
  profile_image_url: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
}

interface SkillRow {
  id: string
  name: string
  category: string | null
  proficiency: number | null
}

interface ServiceShowcase {
  id: string
  eyebrow: string
  title: string
  summary: string
  highlight: string
  deliverables: string[]
  accent: string
  tags: string[]
}

interface PackageCardData {
  id: string
  family: string
  title: string
  pitch: string
  bestFor: string
  timeline: string
  deliverables: string[]
  accent: string
}

interface BuildingNext {
  id: string
  title: string
  description: string
  tags: string[]
  accent: string
}

interface SiteSettings {
  id: string
  hero_title: string
  hero_badge: string
  contact_title: string
  contact_subtitle: string
  footer_text: string
  ticker_items: string[]
}

interface SiteSettingsRow {
  id: string
  hero_title: string | null
  hero_badge: string | null
  contact_title: string | null
  contact_subtitle: string | null
  footer_text: string | null
  ticker_items: unknown
}

interface HeroStat {
  id: string
  value: string
  label: string
  order_num: number
}

interface TimelineItem {
  id: string
  phase: string
  description: string
  order_num: number
}

interface SkillCategoryRow {
  id: string
  title: string
  skills: unknown
  order_num: number
}

interface SkillCategoryDisplay {
  title: string
  skills: string[]
}

interface ServiceShowcaseRow {
  id: string
  eyebrow: string
  title: string
  summary: string
  highlight: string
  deliverables: unknown
  accent: string | null
  tags: unknown
}

interface OfferPackageRow {
  id: string
  family: string
  title: string
  pitch: string
  best_for: string
  timeline: string
  deliverables: unknown
  accent: string | null
}

interface BuildingNextRow {
  id: string
  title: string
  description: string
  tags: unknown
  accent: string | null
}

const fallbackSiteSettings: SiteSettings = {
  id: 'fallback-site-settings',
  hero_title: 'I build what most people think takes years to learn.',
  hero_badge: 'Available for projects',
  contact_title: "Got a project in mind? Let's build it.",
  contact_subtitle:
    'Tell me what you need - a website, a chatbot, or both. I will get back to you with a clear plan and timeline.',
  footer_text: 'Built with Next.js, Supabase, and a lot of late nights.',
  ticker_items: [
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'Tailwind CSS',
    'Supabase',
    'Node.js',
    'AI Chatbots',
    'Responsive Design',
    'Git & GitHub',
    'AWS',
    'REST APIs',
  ],
}

const fallbackAbout: Required<AboutData> = {
  name: 'Muneeb Ur Rehman',
  tagline: 'CS student who builds websites and AI systems faster than most people expect.',
  bio: 'I picked up web development and AI automation on my own, started shipping real projects within weeks, and I have not slowed down. I build premium websites and smart chatbot systems for businesses that want to stand out.',
  profile_image_url: null,
  github_url: 'https://github.com/muneeb1st',
  linkedin_url: null,
  twitter_url: null,
}

const fallbackProjects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'This Portfolio',
    description:
      'The site you are looking at right now. A Next.js portfolio with glassmorphism design, 3D tilt interactions, scroll-reveal animations, ambient cursor spotlight, Supabase-powered CMS, and a full admin panel. Built from scratch.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    image_url: null,
    demo_url: null,
    github_url: 'https://github.com/muneeb1st/portfolio-site',
    featured: true,
  },
  {
    id: 'ar-cafe',
    title: 'AR Cafe Website',
    description:
      'A premium restaurant website with animated customer reviews, dynamic menu management, and a brand-focused design. Built with Next.js and Supabase with a full admin panel for the business owner.',
    technologies: ['Next.js', 'Supabase', 'Responsive Design', 'Admin Panel'],
    image_url: null,
    demo_url: null,
    github_url: null,
    featured: true,
  },
  {
    id: 'ai-chatbot-system',
    title: 'AI Chatbot System',
    description:
      'A self-hosted AI assistant deployed on AWS that connects to Discord for real-time conversations. Features custom conversation flows, server management, and multi-channel support.',
    technologies: ['Python', 'AWS', 'Discord API', 'AI/LLM'],
    image_url: null,
    demo_url: null,
    github_url: null,
    featured: true,
  },
]

const fallbackSkills = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Python', 'Supabase', 'Node.js', 'AI Automation',
]

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'Responsive Design'],
  },
  {
    title: 'Backend & Data',
    skills: ['Python', 'Node.js', 'Supabase', 'PostgreSQL', 'REST APIs'],
  },
  {
    title: 'AI & Automation',
    skills: ['LLM Integration', 'Chatbot Systems', 'AI Agents', 'Discord Bots', 'Prompt Engineering'],
  },
  {
    title: 'Tools & Deployment',
    skills: ['Git', 'GitHub', 'Vercel', 'AWS', 'VS Code', 'Figma'],
  },
]

const heroSignals: HeroStat[] = [
  { id: 'hero-stat-1', value: '430+', label: 'GitHub contributions in the last year', order_num: 1 },
  { id: 'hero-stat-2', value: 'Self-taught', label: 'Learned web development, AI, and deployment independently', order_num: 2 },
  { id: 'hero-stat-3', value: 'CS Student', label: 'Studying Computer Science at NFC-IET, Multan', order_num: 3 },
]

const fallbackTimelineItems: TimelineItem[] = [
  {
    id: 'timeline-1',
    phase: 'Phase 1',
    description: 'Started CS at NFC-IET and began learning programming independently - HTML, CSS, Python, JavaScript.',
    order_num: 1,
  },
  {
    id: 'timeline-2',
    phase: 'Phase 2',
    description: 'Built first full-stack projects with Next.js and Supabase. Shipped a restaurant site and a student portal.',
    order_num: 2,
  },
  {
    id: 'timeline-3',
    phase: 'Phase 3',
    description: 'Deployed AI chatbot systems on AWS. Integrated LLMs with Discord and built custom automation flows.',
    order_num: 3,
  },
  {
    id: 'timeline-4',
    phase: 'Now',
    description: 'Building this portfolio and offering web development and AI chatbot services to real clients.',
    order_num: 4,
  },
]

const serviceShowcases: ServiceShowcase[] = [
  {
    id: 'website-showcase',
    eyebrow: 'Website Systems',
    title: 'Signature websites that feel like a product launch, not a template.',
    summary:
      'Custom portfolio, brand, and business sites with cinematic motion, strong hierarchy, sharp copy layout, and conversion-aware journeys.',
    highlight: 'Perfect for founders, agencies, consultants, personal brands, and modern businesses that need an unforgettable first impression.',
    deliverables: ['Creative direction', 'Custom UI build', 'Lead capture flow', 'Responsive polish'],
    accent: '247, 178, 77',
    tags: ['Storytelling', 'Performance', 'Premium Branding'],
  },
  {
    id: 'chatbot-showcase',
    eyebrow: 'Business Chatbots',
    title: 'AI chatbot experiences that answer faster, qualify leads, and save your team time.',
    summary:
      'Smart chatbot systems for websites and business workflows with branded conversations, lead qualification, FAQ handling, and automation handoffs.',
    highlight: 'Ideal for clinics, service businesses, local brands, support teams, and companies that want fast customer communication without sounding robotic.',
    deliverables: ['Conversation flow', 'Lead routing', 'Business FAQ logic', 'Deployment support'],
    accent: '93, 226, 231',
    tags: ['Lead Qualification', 'Support Automation', 'Branded UX'],
  },
]

const offerPackages: PackageCardData[] = [
  {
    id: 'starter-site',
    family: 'Web Development',
    title: 'Starter Site',
    pitch: 'A clean, modern landing page or portfolio site for personal brands, small businesses, or anyone who needs a strong online presence fast.',
    bestFor: 'Best for: founders, freelancers, local businesses',
    timeline: 'Delivery: 1-2 weeks',
    deliverables: ['Custom design', 'Mobile responsive', 'Contact form', 'SEO setup'],
    accent: '247, 178, 77',
  },
  {
    id: 'full-brand-site',
    family: 'Web Development',
    title: 'Full Brand Site',
    pitch: 'A multi-page website with custom animations, stronger storytelling, and conversion-focused structure for businesses ready to look professional.',
    bestFor: 'Best for: growing businesses, agencies, professionals',
    timeline: 'Delivery: 2-4 weeks',
    deliverables: ['Multi-page build', 'Custom animations', 'CMS integration', 'Performance optimized'],
    accent: '255, 122, 89',
  },
  {
    id: 'lead-chatbot',
    family: 'AI Chatbots',
    title: 'Lead Capture Bot',
    pitch: 'A smart chatbot for your website that greets visitors, answers common questions, collects leads, and routes serious inquiries to you automatically.',
    bestFor: 'Best for: service businesses, clinics, consultants',
    timeline: 'Delivery: 1-2 weeks',
    deliverables: ['Custom Q&A flow', 'Lead capture', 'Email notifications', 'Easy deployment'],
    accent: '93, 226, 231',
  },
  {
    id: 'support-bot',
    family: 'AI Chatbots',
    title: 'Support Assistant',
    pitch: 'An advanced AI chatbot that handles customer support, booking inquiries, and FAQ responses with natural conversation and your brand voice.',
    bestFor: 'Best for: teams, clinics, e-commerce',
    timeline: 'Delivery: 2-3 weeks',
    deliverables: ['Knowledge base setup', 'Booking integration', 'Multi-channel support', 'Analytics dashboard'],
    accent: '126, 166, 255',
  },
]

const buildingNext: BuildingNext[] = [
  {
    id: 'real-estate-demo',
    title: 'Real Estate Platform',
    description: 'A property showcase site with interactive maps and agent booking flows.',
    tags: ['Next.js', 'Maps API', 'Lead Funnels'],
    accent: '247, 178, 77',
  },
  {
    id: 'clinic-chatbot',
    title: 'Healthcare Chatbot',
    description: 'A patient-facing AI assistant for appointment booking and FAQ handling.',
    tags: ['AI/LLM', 'Healthcare', 'Booking Logic'],
    accent: '93, 226, 231',
  },
  {
    id: 'ecommerce-bot',
    title: 'E-Commerce Assistant',
    description: 'A product recommendation chatbot with cart integration and order tracking.',
    tags: ['E-Commerce', 'AI Agent', 'WhatsApp'],
    accent: '126, 166, 255',
  },
]

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function accentStyle(accent: string): CSSProperties {
  return { ['--card-accent' as string]: accent } as CSSProperties
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function normalizeSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    id: row.id,
    hero_title: row.hero_title?.trim() || fallbackSiteSettings.hero_title,
    hero_badge: row.hero_badge?.trim() || fallbackSiteSettings.hero_badge,
    contact_title: row.contact_title?.trim() || fallbackSiteSettings.contact_title,
    contact_subtitle: row.contact_subtitle?.trim() || fallbackSiteSettings.contact_subtitle,
    footer_text: row.footer_text?.trim() || fallbackSiteSettings.footer_text,
    ticker_items: toStringArray(row.ticker_items),
  }
}

function normalizeServiceShowcase(row: ServiceShowcaseRow): ServiceShowcase {
  return {
    id: row.id,
    eyebrow: row.eyebrow,
    title: row.title,
    summary: row.summary,
    highlight: row.highlight,
    deliverables: toStringArray(row.deliverables),
    accent: row.accent?.trim() || '247, 178, 77',
    tags: toStringArray(row.tags),
  }
}

function normalizeOfferPackage(row: OfferPackageRow): PackageCardData {
  return {
    id: row.id,
    family: row.family,
    title: row.title,
    pitch: row.pitch,
    bestFor: row.best_for,
    timeline: row.timeline,
    deliverables: toStringArray(row.deliverables),
    accent: row.accent?.trim() || '247, 178, 77',
  }
}

function normalizeBuildingNext(row: BuildingNextRow): BuildingNext {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: toStringArray(row.tags),
    accent: row.accent?.trim() || '247, 178, 77',
  }
}

function formatIssueDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

function normalizeProject(row: ProjectRow): Project {
  const technologies = Array.isArray(row.technologies)
    ? row.technologies.filter((item): item is string => typeof item === 'string')
    : []

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    technologies,
    image_url: row.image_url,
    demo_url: row.demo_url,
    github_url: row.github_url,
    featured: Boolean(row.featured),
  }
}

function RevealSection({
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
    if (immediate) {
      return
    }

    const node = ref.current

    if (!node) {
      return
    }

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

function TiltPanel({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current

    if (!node) {
      return
    }

    const rect = node.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left) / rect.width
    const offsetY = (event.clientY - rect.top) / rect.height
    const rotateY = (offsetX - 0.5) * 10
    const rotateX = (0.5 - offsetY) * 10

    node.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`)
    node.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`)
    node.style.setProperty('--lift', '-6px')
  }

  function handleLeave() {
    const node = ref.current

    if (!node) {
      return
    }

    node.style.setProperty('--rotate-x', '0deg')
    node.style.setProperty('--rotate-y', '0deg')
    node.style.setProperty('--lift', '0px')
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-panel', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
    >
      {children}
    </div>
  )
}

function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/50">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f4bf4f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4bd37b]" />
      </div>
      <span>{label}</span>
    </div>
  )
}

function WebsiteDemoPreview() {
  return (
    <div className="mock-window">
      <WindowChrome label="website-system.preview" />
      <div className="grid gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
            <span className="offer-chip">Website preview</span>
            <h3 className="font-display mt-4 text-3xl text-[#fff7ec]">Brand Website</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
              A polished responsive site where brand, trust, and conversion work together from the first scroll.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">Focus</div>
                <div className="mt-2 text-sm text-white/80">Brand-first hero</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">Flow</div>
                <div className="mt-2 text-sm text-white/80">Offer stacking</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">Finish</div>
                <div className="mt-2 text-sm text-white/80">Cinematic motion</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-white/40">Launch sections</div>
              <div className="mt-4 space-y-3">
                <div className="mock-line h-3 w-[84%]" />
                <div className="mock-line h-3 w-[66%]" />
                <div className="mock-line h-3 w-[72%]" />
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-[#f7b24d]/20 to-transparent p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-white/40">Conversion layer</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="mock-pill">Lead forms</span>
                <span className="mock-pill">Social proof</span>
                <span className="mock-pill">CTAs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatbotDemoPreview() {
  return (
    <div className="mock-window">
      <WindowChrome label="business-bot.flow" />
      <div className="grid gap-4 p-4 md:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40">
            <span className="signal-dot" />
            Conversation Preview
          </div>
          <div className="mt-4 space-y-3">
            <div className="max-w-[82%] rounded-2xl rounded-bl-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
              Welcome in. Want pricing, support, or a fast answer to your question?
            </div>
            <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-[#5de2e7]/20 px-4 py-3 text-sm text-white/90">
              I need a chatbot for my clinic and booking questions.
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
              Perfect. I can qualify patient questions, handle FAQs, and route ready bookings.
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-[#5de2e7]/20 to-transparent p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40">Automation path</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/80">Intent captured</span>
                <span className="text-xs text-[#5de2e7]">Step 01</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/80">Answer or qualify</span>
                <span className="text-xs text-[#5de2e7]">Step 02</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/80">Book or escalate</span>
                <span className="text-xs text-[#5de2e7]">Step 03</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40">Business outcomes</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="mock-pill">24/7 answers</span>
              <span className="mock-pill">Lead routing</span>
              <span className="mock-pill">Branded tone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  if (!project) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/80 p-4 backdrop-blur-xl"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] p-7 md:p-10"
        onClick={(event) => event.stopPropagation()}
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

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition hover:border-white/20 hover:text-white"
            aria-label="Close project dialog"
          >
            ×
          </button>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{project.description}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.technologies.map((technology) => (
            <span key={technology} className="offer-chip">
              {technology}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {project.demo_url && (
            <a
              href={project.demo_url}
              className="glow-button inline-flex"
              target={project.demo_url.startsWith('#') ? undefined : '_blank'}
              rel={project.demo_url.startsWith('#') ? undefined : 'noreferrer'}
            >
              View demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="ghost-button inline-flex">
              View code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const surfaceRef = useRef<HTMLElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [heroStats, setHeroStats] = useState<HeroStat[]>([])
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [serviceShowcasesData, setServiceShowcasesData] = useState<ServiceShowcase[]>([])
  const [offerPackagesData, setOfferPackagesData] = useState<PackageCardData[]>([])
  const [buildingNextData, setBuildingNextData] = useState<BuildingNext[]>([])
  const [skillCategoriesData, setSkillCategoriesData] = useState<SkillCategoryDisplay[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactStatus, setContactStatus] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const syncSpotlight = useEffectEvent((event: PointerEvent) => {
    const node = surfaceRef.current

    if (!node) {
      return
    }

    node.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
    node.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
  })

  const closeModal = useEffectEvent(() => {
    setSelectedProject(null)
  })

  useEffect(() => {
    window.addEventListener('pointermove', syncSpotlight)

    return () => {
      window.removeEventListener('pointermove', syncSpotlight)
    }
  }, [])

  useEffect(() => {
    if (!selectedProject) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProject])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      const [
        projectsResult,
        certificatesResult,
        aboutResult,
        skillsResult,
        siteSettingsResult,
        heroStatsResult,
        timelineItemsResult,
        serviceShowcasesResult,
        offerPackagesResult,
        buildingNextResult,
        skillCategoriesResult,
      ] = await Promise.allSettled([
        supabase.from('projects').select('*').order('order', { ascending: true }),
        supabase.from('certificates').select('*').order('order', { ascending: true }),
        supabase.from('about').select('*').single(),
        supabase.from('skills').select('*').order('order_num', { ascending: true }),
        supabase.from('site_settings').select('*').maybeSingle(),
        supabase.from('hero_stats').select('*').order('order_num', { ascending: true }),
        supabase.from('timeline_items').select('*').order('order_num', { ascending: true }),
        supabase.from('service_showcases').select('*').order('order_num', { ascending: true }),
        supabase.from('offer_packages').select('*').order('order_num', { ascending: true }),
        supabase.from('building_next').select('*').order('order_num', { ascending: true }),
        supabase.from('skill_categories').select('*').order('order_num', { ascending: true }),
      ])

      if (cancelled) {
        return
      }

      const nextProjects =
        projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value.data)
          ? (projectsResult.value.data as ProjectRow[]).map(normalizeProject)
          : []

      const nextCertificates =
        certificatesResult.status === 'fulfilled' && Array.isArray(certificatesResult.value.data)
          ? (certificatesResult.value.data as Certificate[])
          : []

      const nextAbout =
        aboutResult.status === 'fulfilled' && aboutResult.value.data
          ? (aboutResult.value.data as AboutData)
          : null

      const nextSkills =
        skillsResult.status === 'fulfilled' && Array.isArray(skillsResult.value.data)
          ? (skillsResult.value.data as SkillRow[])
          : []

      const nextSiteSettings =
        siteSettingsResult.status === 'fulfilled' && siteSettingsResult.value.data
          ? normalizeSiteSettings(siteSettingsResult.value.data as SiteSettingsRow)
          : null

      const nextHeroStats =
        heroStatsResult.status === 'fulfilled' && Array.isArray(heroStatsResult.value.data)
          ? (heroStatsResult.value.data as HeroStat[])
          : []

      const nextTimelineItems =
        timelineItemsResult.status === 'fulfilled' && Array.isArray(timelineItemsResult.value.data)
          ? (timelineItemsResult.value.data as TimelineItem[])
          : []

      const nextServiceShowcases =
        serviceShowcasesResult.status === 'fulfilled' && Array.isArray(serviceShowcasesResult.value.data)
          ? (serviceShowcasesResult.value.data as ServiceShowcaseRow[]).map(normalizeServiceShowcase)
          : []

      const nextOfferPackages =
        offerPackagesResult.status === 'fulfilled' && Array.isArray(offerPackagesResult.value.data)
          ? (offerPackagesResult.value.data as OfferPackageRow[]).map(normalizeOfferPackage)
          : []

      const nextBuildingNext =
        buildingNextResult.status === 'fulfilled' && Array.isArray(buildingNextResult.value.data)
          ? (buildingNextResult.value.data as BuildingNextRow[]).map(normalizeBuildingNext)
          : []

      const nextSkillCategories =
        skillCategoriesResult.status === 'fulfilled' && Array.isArray(skillCategoriesResult.value.data)
          ? (skillCategoriesResult.value.data as SkillCategoryRow[]).map((row) => ({
              title: row.title,
              skills: toStringArray(row.skills),
            }))
          : []

      startTransition(() => {
        setProjects(nextProjects)
        setCertificates(nextCertificates)
        setAboutData(nextAbout)
        setSkills(nextSkills)
        setSiteSettings(nextSiteSettings)
        setHeroStats(nextHeroStats)
        setTimelineItems(nextTimelineItems)
        setServiceShowcasesData(nextServiceShowcases)
        setOfferPackagesData(nextOfferPackages)
        setBuildingNextData(nextBuildingNext)
        setSkillCategoriesData(nextSkillCategories)
      })
    }

    void fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setContactSubmitting(true)
    setContactStatus(null)

    const { error } = await supabase.from('contact_messages').insert([contactForm])

    if (error) {
      setContactStatus({
        tone: 'error',
        message: 'Message did not send. Try again and I will make sure we get it through.',
      })
    } else {
      setContactStatus({
        tone: 'success',
        message: 'Message sent. I will get back to you with ideas for your build.',
      })
      setContactForm({ name: '', email: '', message: '' })
    }

    setContactSubmitting(false)
  }

  const profile = {
    name: aboutData?.name?.trim() || fallbackAbout.name,
    tagline: aboutData?.tagline?.trim() || fallbackAbout.tagline,
    bio: aboutData?.bio?.trim() || fallbackAbout.bio,
    profileImage: aboutData?.profile_image_url || null,
    socialLinks: [
      { label: 'GitHub', href: aboutData?.github_url || fallbackAbout.github_url },
      { label: 'LinkedIn', href: aboutData?.linkedin_url || fallbackAbout.linkedin_url },
      { label: 'Twitter', href: aboutData?.twitter_url || fallbackAbout.twitter_url },
    ].filter((item): item is { label: string; href: string } => Boolean(item.href)),
  }

  const projectDeck = projects.length > 0 ? projects : fallbackProjects
  const featuredProjects = projectDeck.filter((project) => project.featured).slice(0, 3)
  const displayProjects = (featuredProjects.length > 0 ? featuredProjects : projectDeck).slice(0, 3)
  const displaySkills = skills.length > 0 ? skills.slice(0, 8).map((skill) => skill.name) : fallbackSkills
  const featuredCertificates = certificates.slice(0, 3)
  const activeSiteSettings = siteSettings ?? fallbackSiteSettings
  const displayTickerItems =
    activeSiteSettings.ticker_items.length > 0 ? activeSiteSettings.ticker_items : fallbackSiteSettings.ticker_items
  const displayHeroStats = heroStats.length > 0 ? heroStats : heroSignals
  const displayTimelineItems = timelineItems.length > 0 ? timelineItems : fallbackTimelineItems
  const displayServiceShowcases = serviceShowcasesData.length > 0 ? serviceShowcasesData : serviceShowcases
  const displayOfferPackages = offerPackagesData.length > 0 ? offerPackagesData : offerPackages
  const displayBuildingNext = buildingNextData.length > 0 ? buildingNextData : buildingNext
  const displaySkillCategories = skillCategoriesData.length > 0 ? skillCategoriesData : skillCategories

  return (
    <main ref={surfaceRef} className="page-shell relative overflow-x-clip pb-14">
      <div className="ambient-spotlight" aria-hidden />
      <div className="site-grid" aria-hidden />
      <div className="hero-orbit hero-orbit-one" aria-hidden />
      <div className="hero-orbit hero-orbit-two" aria-hidden />
      <div className="hero-orbit hero-orbit-three" aria-hidden />

      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5">
          <div className="glass-panel flex items-center justify-between rounded-full px-3 sm:px-4 py-2.5 sm:py-3 md:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-display text-sm sm:text-lg text-[#fff7ec]">{profile.name?.split(' ')[0] || 'Muneeb'}</span>
              <span className="hidden text-xs uppercase tracking-[0.3em] text-white/35 md:inline">
                Web Dev · AI Builder
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <a href="https://github.com/muneeb1st" target="_blank" rel="noreferrer" className="text-white/50 transition hover:text-white" aria-label="GitHub profile">
                <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem]" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.964 1.121.858-.24 1.786-.357 2.714-.357.927 0 1.855.117 2.714.357 1.956-1.443 2.964-1.121 2.964-1.121.652 1.652.24 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              <nav className="hidden items-center gap-6 text-sm text-white/62 lg:flex">
                <a href="#about" className="transition hover:text-white">About</a>
                <a href="#projects" className="transition hover:text-white">Projects</a>
                <a href="#services" className="transition hover:text-white">Services</a>
                <a href="#contact" className="transition hover:text-white">Contact</a>
              </nav>

              <a href="#contact" className="glow-button hidden md:inline-flex text-sm px-4 py-2">
                Let&apos;s work together
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-8 md:pb-20 md:pt-16">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[1.08fr,0.92fr]">
          <RevealSection immediate>
            <div className="status-badge">
              <span className="signal-dot" />
              {activeSiteSettings.hero_badge}
            </div>

            <h1 className="font-display mt-6 sm:mt-8 text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#fff7ec]">
              {activeSiteSettings.hero_title}
            </h1>

            <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-white/70">
              {profile.tagline}
            </p>

            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-white/55">{profile.bio}</p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              <a href="#projects" className="glow-button inline-flex text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">See my work</a>
              <a href="#contact" className="ghost-button inline-flex text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">Work with me</a>
            </div>
          </RevealSection>

          <RevealSection immediate className="lg:pt-4">
            <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
              <div className="relative flex items-center justify-center py-8 sm:py-10 bg-gradient-to-b from-white/[0.08] to-transparent">
                <div className="avatar-ring">
                  <Image
                    src={profile.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=Muneeb&backgroundColor=247,178,77'}
                    alt={profile.name ?? 'Profile portrait'}
                    width={160}
                    height={160}
                    className="rounded-full"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
              </div>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="text-xs uppercase tracking-[0.3em] text-white/38 mb-4 sm:mb-5">What I bring to the table</div>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="metric-card">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">Web Dev</div>
                    <div className="mt-2 font-display text-lg sm:text-xl text-[#fff7ec]">Premium Websites</div>
                    <p className="mt-1.5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/60">
                      Modern, responsive sites with clean design.
                    </p>
                  </div>
                  <div className="metric-card">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">AI Systems</div>
                    <div className="mt-2 font-display text-lg sm:text-xl text-[#fff7ec]">AI Chatbots</div>
                    <p className="mt-1.5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/60">
                      Smart assistants for leads and support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        <RevealSection immediate className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          {displayHeroStats.map((signal) => (
            <div key={signal.value} className="metric-card">
              <div className={signal.value === '430+' ? 'stat-number' : 'font-display text-2xl sm:text-3xl text-[#fff7ec]'}>{signal.value}</div>
              <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/58">{signal.label}</p>
            </div>
          ))}
        </RevealSection>
      </section>

      <section className="ticker border-y border-white/10 py-3 sm:py-4">
        <div className="ticker__track">
          {displayTickerItems.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-4 text-sm uppercase tracking-[0.28em] text-white/48">
              <span>{item}</span>
              <span className="text-[#5de2e7]">•</span>
            </div>
          ))}
        </div>
      </section>

      <RevealSection id="about" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="eyebrow">My story</div>
          <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">
            Started recently. Already building things that work.
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
            No CS degree yet, no years of experience. Just obsessive learning, real projects shipped, and a track record that speaks faster than a resume.
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
            <div className="eyebrow mb-5 sm:mb-6">Learning timeline</div>
            <div className="space-y-5 sm:space-y-6">
              {displayTimelineItems.map((item) => (
                <div key={item.phase} className="timeline-line">
                  <div className="text-xs uppercase tracking-[0.22em] text-[#5de2e7] mb-1">{item.phase}</div>
                  <p className="text-sm leading-6 text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
            <div className="eyebrow mb-5 sm:mb-6">Skill stack</div>
            <div className="space-y-5 sm:space-y-6">
              {displaySkillCategories.map((cat) => (
                <div key={cat.title}>
                  <div className="skill-category-title">{cat.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <span key={s} className="offer-chip">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">Real projects</div>
          <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">
            Everything here is built, shipped, or in active development.
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
            I don&apos;t show mockups. These are real things I have built. More coming as I keep shipping.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              className="text-left"
            >
              <TiltPanel className="package-card h-full rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 md:p-6" style={accentStyle(index === 0 ? '247, 178, 77' : index === 1 ? '93, 226, 231' : '255, 122, 89')}>
                <div className="overflow-hidden rounded-[1.2rem] sm:rounded-[1.4rem] border border-white/10 bg-black/20">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      width={1200}
                      height={760}
                      className="h-48 sm:h-64 w-full object-cover transition duration-500 hover:scale-105"
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
                      <span key={technology} className="offer-chip">
                        {technology}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm uppercase tracking-[0.24em] text-[#5de2e7]">View details →</div>
                </div>
              </TiltPanel>
            </button>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="services" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">What I offer</div>
          <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">
            I build two things: premium websites and smart chatbots.
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
            Every project gets the same obsessive attention to detail. I work directly with you, no middlemen, no templates.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 xl:grid-cols-2">
          {displayServiceShowcases.map((item, index) => (
            <TiltPanel key={item.id} className="package-card rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6" style={accentStyle(item.accent)}>
              <div className="text-xs uppercase tracking-[0.28em] text-white/38">{item.eyebrow}</div>
              <h3 className="font-display mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl text-[#fff7ec]">{item.title}</h3>
              <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-7 text-white/62">{item.summary}</p>
              <p className="mt-3 sm:mt-5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/52">{item.highlight}</p>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="offer-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 sm:mt-8">
                {index === 0 ? <WebsiteDemoPreview /> : <ChatbotDemoPreview />}
              </div>
              <div className="mt-5 sm:mt-7 grid gap-3 sm:grid-cols-2">
                {item.deliverables.map((deliverable) => (
                  <div key={deliverable} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/74">
                    {deliverable}
                  </div>
                ))}
              </div>
            </TiltPanel>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {displayOfferPackages.map((item) => (
            <TiltPanel key={item.id} className="package-card rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5" style={accentStyle(item.accent)}>
              <div className="text-xs uppercase tracking-[0.24em] text-white/38">{item.family}</div>
              <h3 className="font-display mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl text-[#fff7ec]">{item.title}</h3>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/62">{item.pitch}</p>
              <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm text-white/55">
                <p>{item.bestFor}</p>
                <p>{item.timeline}</p>
              </div>
              <div className="mt-4 sm:mt-6 space-y-3">
                {item.deliverables.map((deliverable) => (
                  <div key={deliverable} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/76">
                    {deliverable}
                  </div>
                ))}
              </div>
            </TiltPanel>
          ))}
        </div>
      </RevealSection>

      {(displaySkills.length > 0 || featuredCertificates.length > 0) && (
        <RevealSection className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
              <div className="eyebrow">Skills & proof</div>
              <h2 className="font-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl text-[#fff7ec]">
                The stack behind the work.
              </h2>
              <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-white/62">
                Every skill here has been used in a real project. Certificates back it up.
              </p>
              <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
                {displaySkills.map((skill) => (
                  <span key={skill} className="offer-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
              {featuredCertificates.length > 0 ? (
                featuredCertificates.map((certificate) => (
                  <div key={certificate.id} className="package-card rounded-[1.4rem] sm:rounded-[1.6rem] p-4 sm:p-5" style={accentStyle('126, 166, 255')}>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/38">Credential</div>
                    <h3 className="font-display mt-3 sm:mt-4 text-xl sm:text-2xl text-[#fff7ec]">{certificate.title}</h3>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-5 sm:leading-6 text-white/62">{certificate.issuer}</p>
                    <p className="mt-2 sm:mt-3 text-xs uppercase tracking-[0.24em] text-white/38">
                      {formatIssueDate(certificate.issue_date)}
                    </p>
                    {certificate.credential_url && (
                      <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 sm:mt-6 inline-flex text-xs sm:text-sm uppercase tracking-[0.24em] text-[#5de2e7]"
                      >
                        View credential →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="package-card rounded-[1.4rem] sm:rounded-[1.6rem] p-4 sm:p-5 sm:col-span-3" style={accentStyle('126, 166, 255')}>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/38">Portfolio note</div>
                  <h3 className="font-display mt-3 sm:mt-4 text-2xl sm:text-3xl text-[#fff7ec]">Ready for live proof blocks</h3>
                  <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-6 sm:leading-7 text-white/62">
                    When your certificates, testimonials, or more project data are added through the admin, this section is already shaped to display them elegantly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      )}

      <RevealSection id="roadmap" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">What&apos;s next</div>
          <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">
            Projects I&apos;m actively working toward.
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
            These are not hypothetical. They&apos;re next on my build list.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {displayBuildingNext.map((item) => (
            <TiltPanel key={item.id} className="package-card rounded-[1.5rem] sm:rounded-[1.8rem] p-4 sm:p-5" style={accentStyle(item.accent)}>
              <div className="text-xs uppercase tracking-[0.24em] text-white/38">Coming soon</div>
              <h3 className="font-display mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl text-[#fff7ec]">{item.title}</h3>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/62">{item.description}</p>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="offer-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </TiltPanel>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="glass-panel rounded-[1.75rem] sm:rounded-[2.2rem] p-5 sm:p-6 md:p-8 lg:p-10">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.92fr,1.08fr]">
            <div>
              <div className="eyebrow">Get in touch</div>
              <h2 className="font-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#fff7ec]">
                {activeSiteSettings.contact_title}
              </h2>
              <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-white/62">
                {activeSiteSettings.contact_subtitle}
              </p>

              <div className="mt-6 sm:mt-8 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/72">
                  Custom websites with modern design, animations, and mobile-first approach.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/72">
                  AI chatbots that handle leads, answer questions, and save you time.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/72">
                  Fast turnaround, direct communication, no corporate overhead.
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="grid gap-4 sm:gap-5">
              <div>
                <label className="mb-2 block text-xs sm:text-sm uppercase tracking-[0.22em] text-white/48">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 sm:py-4 text-sm sm:text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#5de2e7]"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs sm:text-sm uppercase tracking-[0.22em] text-white/48">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 sm:py-4 text-sm sm:text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#5de2e7]"
                  placeholder="you@example.com"
                  required
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="mb-2 block text-xs sm:text-sm uppercase tracking-[0.22em] text-white/48">Project vision</label>
                <textarea
                  value={contactForm.message}
                  onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/12 bg-white/5 px-4 py-3 sm:py-4 text-sm sm:text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#5de2e7]"
                  placeholder="Tell me what you want to launch, improve, or automate."
                  required
                />
              </div>

              {contactStatus && (
                <div
                  className={cn(
                    'rounded-2xl border px-4 py-4 text-xs sm:text-sm',
                    contactStatus.tone === 'success'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                      : 'border-rose-400/30 bg-rose-400/10 text-rose-200'
                  )}
                >
                  {contactStatus.message}
                </div>
              )}

              <button type="submit" disabled={contactSubmitting} className="glow-button inline-flex justify-center text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-65">
                {contactSubmitting ? 'Sending your note...' : 'Send project request'}
              </button>
            </form>
          </div>
        </div>
      </RevealSection>

      <footer className="mx-auto mt-12 sm:mt-16 max-w-7xl px-4 sm:px-6 pb-10 pt-10 sm:pt-12 text-center text-xs sm:text-sm text-white/42">
        <div className="flex justify-center gap-6 mb-3 sm:mb-4">
          <a href="https://github.com/muneeb1st" target="_blank" rel="noreferrer" className="transition hover:text-white">GitHub</a>
        </div>
        <p>© 2026 {profile.name}. {activeSiteSettings.footer_text}</p>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  )
}
