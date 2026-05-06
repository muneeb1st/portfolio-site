import Link from 'next/link'
import {
  fetchAllPortfolioData,
  fetchCriticalData,
  fallbackSkillCategories,
  fallbackTimelineItems,
} from '@/lib/data'
import { AmbientSpotlight, MotionOrchestrator, RevealSection, StudioConsole, TiltPanel } from '@/components/client-only'
import { ContactForm } from '@/components/contact-form'
import { ProjectsListClient } from '@/components/projects-client'

export const dynamic = 'force-dynamic'

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
      <p className="section-label">{label}</p>
      <h2 className="section-heading">{title}</h2>
      {children ? <div className="section-copy">{children}</div> : null}
    </div>
  )
}

async function Header() {
  const { about } = await fetchCriticalData()
  const { cleanName } = splitName(about.name)

  return (
    <header className="site-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="brand-mark" aria-label={`${cleanName} home`} data-magnetic>
          <span className="brand-mark__symbol">MR</span>
          <span className="hidden sm:block">{cleanName}</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-stone-300/80 md:flex">
          <Link href="#work" className="nav-link">Work</Link>
          <Link href="#services" className="nav-link">Services</Link>
          <Link href="#process" className="nav-link">Process</Link>
          <Link href="#about" className="nav-link">About</Link>
        </div>
        <Link href="#contact" className="button button--small" data-magnetic>
          Start a project
        </Link>
      </nav>
    </header>
  )
}

async function HeroSection() {
  const { about, siteSettings } = await fetchCriticalData()
  const { heroStats } = await fetchAllPortfolioData()
  const { cleanName, firstName } = splitName(about.name)
  const profileImage = about.profile_image_url

  return (
    <section className="hero-section mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 md:pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pt-20">
      <RevealSection immediate className="max-w-3xl">
        <p className="section-label">Premium websites and AI systems</p>
        <h1 className="hero-title">{siteSettings.hero_title || 'I build premium digital systems for brands that need to be taken seriously.'}</h1>
        <p className="hero-copy">{about.tagline}</p>
        <p className="hero-subcopy">{about.bio}</p>
        <div className="hero-motion" aria-hidden="true">
          <span className="hero-motion__node" />
          <span className="hero-motion__node" />
          <span className="hero-motion__node" />
          <span className="motion-word">Strategy</span>
          <span className="motion-word">Design</span>
          <span className="motion-word">Launch</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#work" className="button" data-magnetic>See selected work</Link>
          <Link href="#contact" className="button button--ghost" data-magnetic>Work with {firstName}</Link>
        </div>
      </RevealSection>

      <RevealSection immediate>
        <StudioConsole cleanName={cleanName} profileImage={profileImage} />
      </RevealSection>

      <RevealSection immediate className="lg:col-span-2">
        <div className="proof-bar">
          {heroStats.slice(0, 3).map((stat) => (
            <div key={stat.id} className="proof-item">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </RevealSection>
    </section>
  )
}

async function WorkSection() {
  const { projects } = await fetchAllPortfolioData()

  return (
    <RevealSection id="work" className="section-wrap">
      <SectionIntro
        label="Selected work"
        title="Case-study style proof for clients who care about finish."
      >
        <p>
          Every project here is framed around trust, conversion, and the kind of craft that makes a first impression feel expensive.
        </p>
      </SectionIntro>
      <ProjectsListClient projects={projects} />
    </RevealSection>
  )
}

function KineticBand() {
  const items = ['Premium websites', 'AI chatbots', 'Conversion systems', 'Fast launches', 'Editorial motion', 'Supabase CMS']
  const track = [...items, ...items]

  return (
    <div className="kinetic-band" aria-hidden="true">
      <div className="kinetic-band__track">
        {track.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

async function ServicesSection() {
  const { serviceShowcases, offerPackages } = await fetchAllPortfolioData()

  return (
    <RevealSection id="services" className="section-wrap">
      <SectionIntro
        label="Services"
        title="Two focused offers, built with the same standard of polish."
      >
        <p>
          The positioning stays intentionally narrow: premium websites that convert and AI chatbot systems that make businesses faster.
        </p>
      </SectionIntro>

      <div className="service-grid mt-10">
        {serviceShowcases.map((service) => (
          <TiltPanel key={service.id} className="service-panel">
            <p className="panel-kicker">{service.eyebrow}</p>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <div className="service-panel__highlight">{service.highlight}</div>
            <div className="tag-row">
              {service.deliverables.slice(0, 4).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </TiltPanel>
        ))}
      </div>

      <div className="package-list mt-8">
        {offerPackages.slice(0, 4).map((item) => (
          <div key={item.id} className="package-row">
            <div>
              <p className="panel-kicker">{item.family}</p>
              <h3>{item.title}</h3>
              <p>{item.pitch}</p>
            </div>
            <div className="package-row__meta">
              <span>{item.bestFor}</span>
              <strong>{item.timeline}</strong>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

async function ProcessSection() {
  const steps = [
    {
      title: 'Clarify the offer',
      copy: 'We define the audience, core promise, page structure, and what the site needs to make people believe.',
    },
    {
      title: 'Design the signature',
      copy: 'Typography, spacing, motion, and visuals are shaped into a premium system before implementation takes over.',
    },
    {
      title: 'Build for speed',
      copy: 'The site is implemented static-first with stable layouts, optimized media, and low-JS interaction patterns.',
    },
    {
      title: 'Launch and refine',
      copy: 'Content, SEO, admin editing, analytics readiness, and deployment checks are handled before handoff.',
    },
  ]

  return (
    <RevealSection id="process" className="section-wrap">
      <SectionIntro
        label="Process"
        title="A clear path from rough idea to premium launch."
      />
      <div className="process-list mt-10">
        {steps.map((step, index) => (
          <div key={step.title} className="process-item">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

async function AboutSection() {
  const { timelineItems, skillCategories } = await fetchAllPortfolioData()
  const timeline = timelineItems.length ? timelineItems : fallbackTimelineItems
  const skills = skillCategories.length ? skillCategories : fallbackSkillCategories

  return (
    <RevealSection id="about" className="section-wrap">
      <div className="about-grid">
        <SectionIntro
          label="About"
          title="Self-taught, fast-moving, and serious about the details."
        >
          <p>
            The story is not years of agency polish. It is speed, taste, discipline, and the ability to learn what the project needs until it ships.
          </p>
        </SectionIntro>
        <div className="timeline-card">
          {timeline.slice(0, 4).map((item) => (
            <div key={item.id} className="timeline-row">
              <span>{item.phase}</span>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="skill-grid mt-10">
        {skills.map((category) => (
          <div key={category.title} className="skill-card">
            <h3>{category.title}</h3>
            <div className="tag-row">
              {category.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

async function CertificatesSection() {
  const { certificates } = await fetchAllPortfolioData()

  if (certificates.length === 0) {
    return null
  }

  return (
    <RevealSection id="certificates" className="section-wrap">
      <SectionIntro
        label="Certificates"
        title="Credentials that support the craft."
      >
        <p>
          A compact proof layer for technical learning, professional development, and the credibility behind the work.
        </p>
      </SectionIntro>
      <div className="certificate-grid mt-10">
        {certificates.map((certificate, index) => (
          <a
            key={certificate.id}
            href={certificate.credential_url || '#'}
            target={certificate.credential_url ? '_blank' : undefined}
            rel={certificate.credential_url ? 'noreferrer' : undefined}
            className="certificate-card"
          >
            <div className="certificate-card__index">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <p className="panel-kicker">{certificate.issuer}</p>
              <h3>{certificate.title}</h3>
              {certificate.issue_date ? <span>{new Date(certificate.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span> : null}
            </div>
          </a>
        ))}
      </div>
    </RevealSection>
  )
}

async function ContactSection() {
  const { about, siteSettings } = await fetchCriticalData()

  return (
    <RevealSection id="contact" className="section-wrap pb-12 md:pb-20">
      <div className="contact-grid">
        <SectionIntro label="Contact" title={siteSettings.contact_title}>
          <p>{siteSettings.contact_subtitle}</p>
          <div className="contact-notes">
            <span>Premium website</span>
            <span>AI chatbot</span>
            <span>Launch support</span>
          </div>
          {about.email ? (
            <a className="text-link" href={`mailto:${about.email}`}>{about.email}</a>
          ) : null}
        </SectionIntro>
        <ContactForm />
      </div>
    </RevealSection>
  )
}

async function Footer() {
  const { about, siteSettings } = await fetchCriticalData()
  const { cleanName } = splitName(about.name)

  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-stone-400 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>{cleanName} - {siteSettings.footer_text}</p>
        <div className="flex gap-4">
          {about.github_url ? <a href={about.github_url} target="_blank" rel="noreferrer">GitHub</a> : null}
          {about.linkedin_url ? <a href={about.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {about.twitter_url ? <a href={about.twitter_url} target="_blank" rel="noreferrer">X</a> : null}
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="page-shell">
      <AmbientSpotlight />
      <MotionOrchestrator />
      <div className="site-noise" aria-hidden />
      <Header />
      <HeroSection />
      <KineticBand />
      <WorkSection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <CertificatesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
