import {
  fetchAllPortfolioData,
  type Project,
  type AboutData,
  type SiteSettings,
  type HeroStat,
  type ServiceShowcase,
  type PackageCardData,
} from '@/lib/data'
import Link from 'next/link'
import { AmbientSpotlight, MotionOrchestrator, RevealSection } from '@/components/client-only'
import { NextGenStudioConsole } from '@/components/NextGenConsole'
import { ContactForm } from '@/components/contact-form'
import { KineticBand } from '@/components/KineticBand'
import { ProjectsListClient } from '@/components/projects-client'
import { SiteHeader } from '@/components/SiteHeader'
import { 
  Sparkles, 
  FileText, 
  Code2, 
  ArrowRight,
  Globe,
  Share2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function splitName(name: string | null) {
  const cleanName = name?.trim() || 'Muneeb Ur Rehman'
  const [firstName] = cleanName.split(' ')
  return { cleanName, firstName: firstName || 'Muneeb' }
}

function SectionIntro({
  label,
  title,
  children,
  align = 'left',
}: {
  label: string
  title: string
  children?: React.ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'section-intro mx-auto text-center' : 'section-intro'}>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd98c]/30 bg-[#ffd98c]/10 px-3 py-1 text-xs font-mono font-bold tracking-widest text-[#ffd98c] uppercase mb-3">
        <Sparkles className="h-3 w-3" />
        {label}
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">{title}</h2>
      {children ? <div className="mt-4 text-base md:text-lg text-stone-300/80 max-w-3xl leading-relaxed">{children}</div> : null}
    </div>
  )
}

function Header() {
  return <SiteHeader />
}

function HeroSection({
  about,
  siteSettings,
  heroStats,
}: {
  about: Required<AboutData>
  siteSettings: SiteSettings
  heroStats: HeroStat[]
}) {
  const { cleanName } = splitName(about.name)
  const availabilityText = siteSettings.hero_badge || 'Available for freelance'

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-20">
      {/* Main Hero Header & Interactive Studio Console */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <RevealSection immediate>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-400 backdrop-blur-md mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{availabilityText}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.14]">
              I build web apps,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd98c] via-[#fff0c7] to-[#ffd98c]">
                AI workflows
              </span>
              , and software that actually ships.
            </h1>
          </RevealSection>

          <RevealSection immediate className="space-y-4 text-sm sm:text-base md:text-lg text-stone-300/90 max-w-2xl leading-relaxed">
            <p>
              Hi, I&apos;m <strong className="text-white font-semibold">{cleanName}</strong> — a Computer Science student and Full-Stack Developer specializing in high-performance Next.js 15 systems, Supabase architectures, and custom AI chatbot agents.
            </p>
          </RevealSection>

          {/* Quick Hero Actions */}
          <RevealSection immediate className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#ffd98c] px-6 py-3 text-xs font-mono font-bold text-black shadow-[0_0_20px_rgba(255,217,140,0.25)] transition-all hover:bg-[#ffe1a6] hover:shadow-[0_0_25px_rgba(255,217,140,0.4)] hover:scale-105 active:scale-95"
            >
              <span>Work With Me</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-mono font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <Code2 className="h-3.5 w-3.5 text-[#ffd98c]" />
              <span>View Projects</span>
            </a>

            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-3 text-xs font-mono font-semibold text-stone-400 transition-all hover:border-white/20 hover:text-white"
            >
              <FileText className="h-3.5 w-3.5 text-stone-400" />
              <span>Live Resume</span>
            </Link>
          </RevealSection>
        </div>

        {/* Live Interactive Studio Console */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <RevealSection immediate className="w-full max-w-lg">
            <NextGenStudioConsole 
              cleanName={cleanName} 
              profileImage={about.profile_image_url} 
            />
          </RevealSection>
        </div>
      </div>

      {/* Proof Bar Metric Nodes */}
      {heroStats && heroStats.length > 0 && (
        <RevealSection immediate className="mt-10 sm:mt-16">
          <div className={`grid gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl ${
            heroStats.length === 1 
              ? 'grid-cols-1 max-w-sm mx-auto'
              : heroStats.length === 2 
                ? 'grid-cols-2 max-w-2xl mx-auto'
                : heroStats.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 lg:grid-cols-4'
          }`}>
            {heroStats.map((stat) => {
              const cleanValue = stat.value.replace(/\s*-\s*/g, ' - ').trim()
              return (
                <div 
                  key={stat.id} 
                  className="flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
                >
                  <strong className="block font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#ffd98c] tracking-tight leading-none whitespace-nowrap">
                    {cleanValue}
                  </strong>
                  <span className="block text-[11px] sm:text-xs font-mono text-stone-300 mt-2 uppercase tracking-wider leading-snug max-w-[220px] text-center">
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </RevealSection>
      )}
    </section>
  )
}

function WorkSection({ projects }: { projects: Project[] }) {
  return (
    <RevealSection id="work" className="mx-auto max-w-7xl px-4 py-20 sm:px-6" immediate>
      <SectionIntro
        label="Selected Work"
        title="Projects with real architecture, decisions, and shipped links."
      >
        <p>
          A verification layer for production craftsmanship: ultra-responsive frontends, Supabase-backed real-time databases, AI agents, and live public deployments.
        </p>
      </SectionIntro>
      <ProjectsListClient projects={projects} />
    </RevealSection>
  )
}

function ServicesSection({ serviceShowcases, offerPackages }: { serviceShowcases: ServiceShowcase[]; offerPackages: PackageCardData[] }) {
  return (
    <RevealSection id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6" immediate>
      <SectionIntro
        label="Services &amp; Scope"
        title="Two focused offerings engineered with absolute polish."
      >
        <p>
          Positioned for clear ROI: bespoke high-conversion websites and custom AI chatbot systems that automate client qualification.
        </p>
      </SectionIntro>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {serviceShowcases.map((service) => (
          <div 
            key={service.id} 
            className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-[#141822]/90 to-[#0a0d14]/95 p-7 md:p-9 shadow-2xl backdrop-blur-xl transition-all hover:border-[#ffd98c]/40 hover:-translate-y-1"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-[#ffd98c] mb-4">
                {service.eyebrow}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-[#ffd98c] transition-colors">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-stone-300 leading-relaxed">
                {service.summary}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-6 text-xs font-mono text-stone-400">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="text-[#ffd98c]">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">Verified: <strong className="text-white">{service.highlight}</strong></span>
              <a href="#contact" className="text-xs font-mono font-semibold text-[#ffd98c] group-hover:underline flex items-center gap-1">
                <span>Inquire</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {offerPackages && offerPackages.length > 0 && (
        <div className="mt-16">
          <h3 className="text-center font-display text-2xl font-bold text-white mb-8">
            Structured Sprint Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offerPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#ffd98c] mb-2">
                    <span>{pkg.family}</span>
                    <span>{pkg.timeline}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">{pkg.title}</h4>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">{pkg.pitch}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono text-stone-300 uppercase block tracking-wider">Best For:</span>
                  <p className="text-xs font-mono text-stone-300 mt-1">{pkg.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </RevealSection>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Discovery & Blueprint', desc: 'Define goals, target audience, technical constraints, and exact milestones before writing a single line of code.' },
    { num: '02', title: 'Architecture & Design', desc: 'Build the core database schema, API endpoints, typographic hierarchy, and responsive UI components with sub-pixel polish.' },
    { num: '03', title: 'Iterative Engineering', desc: 'Implement core functionality, live state management, security rules, and real-time database synchronizations.' },
    { num: '04', title: 'Production Verification', desc: 'Lighthouse audit, SEO optimization, responsive stress tests, and automated deployment to global edge infrastructure.' },
  ]

  return (
    <RevealSection id="process" className="mx-auto max-w-7xl px-4 py-20 sm:px-6" immediate>
      <SectionIntro
        label="Methodology"
        title="Predictable, high-velocity software engineering."
      >
        <p>
          Every build follows a battle-tested protocol that guarantees clean code, rapid delivery, and transparent communication.
        </p>
      </SectionIntro>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {steps.map((s) => (
          <div key={s.num} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#ffd98c]/30 transition-all">
            <span className="font-mono text-2xl font-bold text-[#ffd98c] block mb-3">{s.num}</span>
            <h4 className="font-display text-base font-bold text-white mb-2">{s.title}</h4>
            <p className="text-xs text-stone-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

function AboutSection({ about }: { about: Required<AboutData> }) {
  const { cleanName } = splitName(about.name)

  return (
    <RevealSection id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6" immediate>
      <SectionIntro
        label="Background &amp; Ethos"
        title={`Meet ${cleanName}`}
      >
        <p>
          A Computer Science undergraduate with a builder mindset — combining academic rigor with hands-on production engineering.
        </p>
      </SectionIntro>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-stone-300 leading-relaxed">
          <p>
            {about.bio || "I'm a full-stack engineer and AI specialist who builds production-ready web apps and automated systems. I combine modern frontend frameworks with robust backend architectures and AI-driven automation."}
          </p>
          <p>
            {about.tagline || "My approach centers on rapid execution, clean software architecture, and delivering high-value digital solutions that solve real business bottlenecks."}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            {about.github_url && (
              <a
                href={about.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono font-semibold text-stone-300 hover:border-white/30 hover:text-white"
              >
                <Code2 className="h-4 w-4 text-[#ffd98c]" /> GitHub Profile
              </a>
            )}
            {about.linkedin_url && (
              <a
                href={about.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono font-semibold text-stone-300 hover:border-white/30 hover:text-white"
              >
                <Globe className="h-4 w-4 text-[#ffd98c]" /> LinkedIn
              </a>
            )}
            {about.twitter_url && (
              <a
                href={about.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono font-semibold text-stone-300 hover:border-white/30 hover:text-white"
              >
                <Share2 className="h-4 w-4 text-[#ffd98c]" /> X / Twitter
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-gradient-to-b from-[#141822]/90 to-[#0a0d14]/95 p-7 md:p-8 space-y-4">
          <span className="text-xs font-mono font-bold text-[#ffd98c] uppercase tracking-wider block">
            Direct Availability
          </span>
          <h4 className="font-display text-2xl font-bold text-white">Let&apos;s talk about your next build</h4>
          <p className="text-sm text-stone-400 leading-relaxed">
            Currently accepting new projects for full-stack applications, conversion redesigns, and AI automation systems.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#ffd98c] bg-[#ffd98c] px-6 py-3 text-xs font-mono font-bold text-black shadow-[0_0_20px_rgba(255,217,140,0.3)] hover:bg-[#ffe1a6] transition-all"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </RevealSection>
  )
}

function ContactSection() {
  return (
    <RevealSection id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6" immediate>
      <SectionIntro
        label="Direct Inquiries"
        title="Ready to build something exceptional?"
      >
        <p>
          Fill out the brief below and I&apos;ll respond with a clear project proposal, scope breakdown, and technical timeline within 24 hours.
        </p>
      </SectionIntro>

      <div className="mt-12">
        <ContactForm />
      </div>
    </RevealSection>
  )
}

function Footer({ about }: { about: Required<AboutData> }) {
  const { cleanName } = splitName(about.name)

  return (
    <footer className="border-t border-white/10 bg-[#06070a] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
        <div>
          <span className="font-display text-lg font-bold text-white">{cleanName}</span>
          <p className="text-xs font-mono text-stone-400 mt-1">Full-Stack Engineer &amp; AI Architect</p>
        </div>
        <p className="text-xs font-mono text-stone-500">
          &copy; {new Date().getFullYear()} {cleanName}. Engineered for maximum performance.
        </p>
      </div>
    </footer>
  )
}

export default async function HomePage() {
  const data = await fetchAllPortfolioData()

  return (
    <div className="relative min-h-screen bg-[#08090c] text-stone-100 selection:bg-[#ffd98c] selection:text-black">
      <AmbientSpotlight />
      <MotionOrchestrator />
      <Header />

      <main>
        <HeroSection about={data.about} siteSettings={data.siteSettings} heroStats={data.heroStats} />
        <KineticBand />
        <WorkSection projects={data.projects} />
        <ServicesSection serviceShowcases={data.serviceShowcases} offerPackages={data.offerPackages} />
        <ProcessSection />
        <AboutSection about={data.about} />
        <ContactSection />
      </main>

      <Footer about={data.about} />
    </div>
  )
}
