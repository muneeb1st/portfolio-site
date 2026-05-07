import { supabase } from './supabase'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  featured: boolean
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url: string | null
}

export interface AboutData {
  name: string | null
  tagline: string | null
  bio: string | null
  email: string | null
  profile_image_url: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
}

export interface SkillRow {
  id: string
  name: string
  category: string | null
  proficiency: number | null
}

export interface SiteSettings {
  id: string
  hero_title: string
  hero_badge: string
  contact_title: string
  contact_subtitle: string
  footer_text: string
  ticker_items: string[]
}

export interface HeroStat {
  id: string
  value: string
  label: string
  order_num: number
}

export interface TimelineItem {
  id: string
  phase: string
  description: string
  order_num: number
}

export interface SkillCategory {
  title: string
  skills: string[]
}

export interface ServiceShowcase {
  id: string
  eyebrow: string
  title: string
  summary: string
  highlight: string
  deliverables: string[]
  accent: string
  tags: string[]
}

export interface PackageCardData {
  id: string
  family: string
  title: string
  pitch: string
  bestFor: string
  timeline: string
  deliverables: string[]
  accent: string
}

export interface BuildingNext {
  id: string
  title: string
  description: string
  tags: string[]
  accent: string
}

export const fallbackSiteSettings: SiteSettings = {
  id: 'fallback-site-settings',
  hero_title: 'I build what most people think takes years to learn.',
  hero_badge: 'Available for projects',
  contact_title: "Ready to scale your digital presence?",
  contact_subtitle:
    "Share your project vision below. I specialize in turning complex requirements into seamless digital experiences. I'll review your details and send over a custom strategy and timeline within 24 hours.",
  footer_text: 'Built with Next.js, Supabase, and a lot of late nights.',
  ticker_items: [
    'React', 'Next.js', 'TypeScript', 'Python', 'Tailwind CSS',
    'Supabase', 'Node.js', 'AI Chatbots', 'Responsive Design', 'Git & GitHub', 'AWS', 'REST APIs',
  ],
}

export const fallbackAbout: Required<AboutData> = {
  name: 'Muneeb Ur Rehman',
  tagline: 'CS student who builds websites and AI systems faster than most people expect.',
  bio: 'I picked up web development and AI automation on my own, started shipping real projects within weeks, and I have not slowed down. I build premium websites and smart chatbot systems for businesses that want to stand out.',
  profile_image_url: null,
  email: 'muneeb@example.com',
  github_url: 'https://github.com/muneeb1st',
  linkedin_url: null,
  twitter_url: null,
}

export const fallbackProjects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'This Portfolio',
    description: 'The site you are looking at right now. A Next.js portfolio with glassmorphism design, 3D tilt interactions, scroll-reveal animations, ambient cursor spotlight, Supabase-powered CMS, and a full admin panel. Built from scratch.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    image_url: null,
    demo_url: null,
    github_url: 'https://github.com/muneeb1st/portfolio-site',
    featured: true,
  },
  {
    id: 'ar-cafe',
    title: 'AR Cafe Website',
    description: 'A premium restaurant website with animated customer reviews, dynamic menu management, and a brand-focused design. Built with Next.js and Supabase with a full admin panel for the business owner.',
    technologies: ['Next.js', 'Supabase', 'Responsive Design', 'Admin Panel'],
    image_url: null,
    demo_url: null,
    github_url: null,
    featured: true,
  },
  {
    id: 'ai-chatbot-system',
    title: 'AI Chatbot System',
    description: 'A self-hosted AI assistant deployed on AWS that connects to Discord for real-time conversations. Features custom conversation flows, server management, and multi-channel support.',
    technologies: ['Python', 'AWS', 'Discord API', 'AI/LLM'],
    image_url: null,
    demo_url: null,
    github_url: null,
    featured: true,
  },
]

export const fallbackSkills = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python', 'Supabase', 'Node.js', 'AI Automation']

export const fallbackSkillCategories: SkillCategory[] = [
  { title: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'Responsive Design'] },
  { title: 'Backend & Data', skills: ['Python', 'Node.js', 'Supabase', 'PostgreSQL', 'REST APIs'] },
  { title: 'AI & Automation', skills: ['LLM Integration', 'Chatbot Systems', 'AI Agents', 'Discord Bots', 'Prompt Engineering'] },
  { title: 'Tools & Deployment', skills: ['Git', 'GitHub', 'Vercel', 'AWS', 'VS Code', 'Figma'] },
]

export const heroSignals: HeroStat[] = [
  { id: 'hero-stat-1', value: '430+', label: 'GitHub contributions in the last year', order_num: 1 },
  { id: 'hero-stat-2', value: 'Self-taught', label: 'Learned web development, AI, and deployment independently', order_num: 2 },
  { id: 'hero-stat-3', value: 'CS Student', label: 'Studying Computer Science at NFC-IET, Multan', order_num: 3 },
]

export const fallbackTimelineItems: TimelineItem[] = [
  { id: 'timeline-1', phase: 'Phase 1', description: 'Started CS at NFC-IET and began learning programming independently - HTML, CSS, Python, JavaScript.', order_num: 1 },
  { id: 'timeline-2', phase: 'Phase 2', description: 'Built first full-stack projects with Next.js and Supabase. Shipped a restaurant site and a student portal.', order_num: 2 },
  { id: 'timeline-3', phase: 'Phase 3', description: 'Deployed AI chatbot systems on AWS. Integrated LLMs with Discord and built custom automation flows.', order_num: 3 },
  { id: 'timeline-4', phase: 'Now', description: 'Building this portfolio and offering web development and AI chatbot services to real clients.', order_num: 4 },
]

export const serviceShowcases: ServiceShowcase[] = [
  {
    id: 'website-showcase',
    eyebrow: 'Website Systems',
    title: 'Signature websites that feel like a product launch, not a template.',
    summary: 'Custom portfolio, brand, and business sites with cinematic motion, strong hierarchy, sharp copy layout, and conversion-aware journeys.',
    highlight: 'Perfect for founders, agencies, consultants, personal brands, and modern businesses that need an unforgettable first impression.',
    deliverables: ['Creative direction', 'Custom UI build', 'Lead capture flow', 'Responsive polish'],
    accent: '247, 178, 77',
    tags: ['Storytelling', 'Performance', 'Premium Branding'],
  },
  {
    id: 'chatbot-showcase',
    eyebrow: 'Business Chatbots',
    title: 'AI chatbot experiences that answer faster, qualify leads, and save your team time.',
    summary: 'Smart chatbot systems for websites and business workflows with branded conversations, lead qualification, FAQ handling, and automation handoffs.',
    highlight: 'Ideal for clinics, service businesses, local brands, support teams, and companies that want fast customer communication without sounding robotic.',
    deliverables: ['Conversation flow', 'Lead routing', 'Business FAQ logic', 'Deployment support'],
    accent: '93, 226, 231',
    tags: ['Lead Qualification', 'Support Automation', 'Branded UX'],
  },
]

export const offerPackages: PackageCardData[] = [
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

export const buildingNext: BuildingNext[] = [
  { id: 'real-estate-demo', title: 'Real Estate Platform', description: 'A property showcase site with interactive maps and agent booking flows.', tags: ['Next.js', 'Maps API', 'Lead Funnels'], accent: '247, 178, 77' },
  { id: 'clinic-chatbot', title: 'Healthcare Chatbot', description: 'A patient-facing AI assistant for appointment booking and FAQ handling.', tags: ['AI/LLM', 'Healthcare', 'Booking Logic'], accent: '93, 226, 231' },
  { id: 'ecommerce-bot', title: 'E-Commerce Assistant', description: 'A product recommendation chatbot with cart integration and order tracking.', tags: ['E-Commerce', 'AI Agent', 'WhatsApp'], accent: '126, 166, 255' },
]

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function normalizeBio(value: unknown) {
  const bio = typeof value === 'string' ? value.trim() : ''
  if (!bio || bio === 'Desperate for building real automated systems.') {
    return fallbackAbout.bio
  }
  return bio
}

async function fetchProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('order', { ascending: true })
  if (!data) return fallbackProjects
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    technologies: Array.isArray(row.technologies) ? row.technologies.filter((t: unknown) => typeof t === 'string') : [],
    image_url: row.image_url,
    demo_url: row.demo_url,
    github_url: row.github_url,
    featured: Boolean(row.featured),
  })).length > 0 ? data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    technologies: Array.isArray(row.technologies) ? row.technologies.filter((t: unknown) => typeof t === 'string') : [],
    image_url: row.image_url,
    demo_url: row.demo_url,
    github_url: row.github_url,
    featured: Boolean(row.featured),
  })) : fallbackProjects
}

async function fetchCertificates(): Promise<Certificate[]> {
  const { data } = await supabase.from('certificates').select('*').order('order', { ascending: true })
  return data || []
}

async function fetchAbout(): Promise<Required<AboutData>> {
  const { data } = await supabase.from('about').select('*').single()
  if (!data) return fallbackAbout
  return {
    name: data.name?.trim() || fallbackAbout.name,
    tagline: data.tagline?.trim() || fallbackAbout.tagline,
    bio: normalizeBio(data.bio),
    email: data.email?.trim() || fallbackAbout.email,
    profile_image_url: data.profile_image_url || fallbackAbout.profile_image_url,
    github_url: data.github_url || fallbackAbout.github_url,
    linkedin_url: data.linkedin_url || fallbackAbout.linkedin_url,
    twitter_url: data.twitter_url || fallbackAbout.twitter_url,
  }
}

async function fetchSkills(): Promise<SkillRow[]> {
  const { data } = await supabase.from('skills').select('*').order('order_num', { ascending: true })
  return data || []
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from('site_settings').select('*').maybeSingle()
  if (!data) return fallbackSiteSettings
  return {
    id: data.id,
    hero_title: data.hero_title?.trim() || fallbackSiteSettings.hero_title,
    hero_badge: data.hero_badge?.trim() || fallbackSiteSettings.hero_badge,
    contact_title: data.contact_title?.trim() || fallbackSiteSettings.contact_title,
    contact_subtitle: data.contact_subtitle?.trim() || fallbackSiteSettings.contact_subtitle,
    footer_text: data.footer_text?.trim() || fallbackSiteSettings.footer_text,
    ticker_items: toStringArray(data.ticker_items).length > 0 ? toStringArray(data.ticker_items) : fallbackSiteSettings.ticker_items,
  }
}

async function fetchHeroStats(): Promise<HeroStat[]> {
  const { data } = await supabase.from('hero_stats').select('*').order('order_num', { ascending: true })
  return (data && data.length > 0) ? data : heroSignals
}

async function fetchTimelineItems(): Promise<TimelineItem[]> {
  const { data } = await supabase.from('timeline_items').select('*').order('order_num', { ascending: true })
  return (data && data.length > 0) ? data : fallbackTimelineItems
}

async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const { data } = await supabase.from('skill_categories').select('*').order('order_num', { ascending: true })
  if (!data || data.length === 0) return fallbackSkillCategories
  return data.map((row) => ({
    title: row.title,
    skills: toStringArray(row.skills),
  }))
}

async function fetchServiceShowcases(): Promise<ServiceShowcase[]> {
  const { data } = await supabase.from('service_showcases').select('*').order('order_num', { ascending: true })
  if (!data || data.length === 0) return serviceShowcases
  return data.map((row) => ({
    id: row.id,
    eyebrow: row.eyebrow,
    title: row.title,
    summary: row.summary,
    highlight: row.highlight,
    deliverables: toStringArray(row.deliverables),
    accent: row.accent?.trim() || '247, 178, 77',
    tags: toStringArray(row.tags),
  }))
}

async function fetchOfferPackages(): Promise<PackageCardData[]> {
  const { data } = await supabase.from('offer_packages').select('*').order('order_num', { ascending: true })
  if (!data || data.length === 0) return offerPackages
  return data.map((row) => ({
    id: row.id,
    family: row.family,
    title: row.title,
    pitch: row.pitch,
    bestFor: row.best_for,
    timeline: row.timeline,
    deliverables: toStringArray(row.deliverables),
    accent: row.accent?.trim() || '247, 178, 77',
  }))
}

async function fetchBuildingNext(): Promise<BuildingNext[]> {
  const { data } = await supabase.from('building_next').select('*').order('order_num', { ascending: true })
  if (!data || data.length === 0) return buildingNext
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    tags: toStringArray(row.tags),
    accent: row.accent?.trim() || '247, 178, 77',
  }))
}

export async function fetchAllPortfolioData() {
  const [projects, certificates, about, skills, siteSettings, heroStats, timelineItems, skillCategories, serviceShowcasesData, offerPackagesData, buildingNextData] = await Promise.all([
    fetchProjects(),
    fetchCertificates(),
    fetchAbout(),
    fetchSkills(),
    fetchSiteSettings(),
    fetchHeroStats(),
    fetchTimelineItems(),
    fetchSkillCategories(),
    fetchServiceShowcases(),
    fetchOfferPackages(),
    fetchBuildingNext(),
  ])

  const displayProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured))

  return {
    projects: displayProjects,
    certificates,
    about,
    skills,
    siteSettings,
    heroStats,
    timelineItems,
    skillCategories,
    serviceShowcases: serviceShowcasesData,
    offerPackages: offerPackagesData,
    buildingNext: buildingNextData,
  }
}

export async function fetchCriticalData() {
  const [about, siteSettings] = await Promise.all([
    fetchAbout(),
    fetchSiteSettings(),
  ])
  return { about, siteSettings }
}
