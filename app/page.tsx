import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  fetchAllPortfolioData,
  fetchCriticalData,
  fallbackSiteSettings,
  fallbackTimelineItems,
  fallbackSkillCategories,
} from '@/lib/data'
import { AmbientSpotlight, RevealSection } from '@/components/client-only'
import { ContactForm } from '@/components/contact-form'
import { ProjectsListClient } from '@/components/projects-client'
import {
  HeroSkeleton,
  AboutSkeleton,
  ProjectsSkeleton,
  ServicesSkeleton,
  SkillsSkeleton,
  ContactSkeleton,
  FooterSkeleton,
  TickerSkeleton,
} from '@/components/skeletons'

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

function accentStyle(accent: string): React.CSSProperties {
  return { ['--card-accent' as string]: accent } as React.CSSProperties
}

async function HeroSection() {
  const { about, siteSettings } = await fetchCriticalData()
  const name = about.name?.split(' ')[0] || 'Muneeb'
  const profileImage = about.profile_image_url

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-8 md:pb-20 md:pt-16">
      <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[1.08fr,0.92fr]">
        <RevealSection immediate>
          <div className="status-badge">
            <span className="signal-dot" />
            {siteSettings.hero_badge}
          </div>
          <h1 className="font-display mt-6 sm:mt-8 text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#fff7ec]">
            {siteSettings.hero_title}
          </h1>
          <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-white/70">
            {about.tagline}
          </p>
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-white/55">{about.bio}</p>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link href="#projects" className="glow-button inline-flex text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">See my work</Link>
            <Link href="#contact" className="ghost-button inline-flex text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">Work with me</Link>
          </div>
        </RevealSection>

        <RevealSection immediate className="lg:pt-4">
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
            <div className="relative flex items-center justify-center py-8 sm:py-10 bg-gradient-to-b from-white/[0.08] to-transparent">
              <div className="avatar-ring">
                <Image
                  src={profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=Muneeb&backgroundColor=247,178,77'}
                  alt={name}
                  width={160}
                  height={160}
                  className="rounded-full"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                  sizes="160px"
                />
              </div>
            </div>
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <div className="text-xs uppercase tracking-[0.3em] text-white/38 mb-4 sm:mb-5">What I bring to the table</div>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="metric-card">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/40">Web Dev</div>
                  <div className="mt-2 font-display text-lg sm:text-xl text-[#fff7ec]">Premium Websites</div>
                  <p className="mt-1.5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/60">Modern, responsive sites with clean design.</p>
                </div>
                <div className="metric-card">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/40">AI Systems</div>
                  <div className="mt-2 font-display text-lg sm:text-xl text-[#fff7ec]">AI Chatbots</div>
                  <p className="mt-1.5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/60">Smart assistants for leads and support.</p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>

      <RevealSection immediate className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="metric-card">
          <div className="stat-number">430+</div>
          <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/58">GitHub contributions in the last year</p>
        </div>
        <div className="metric-card">
          <div className="font-display text-2xl sm:text-3xl text-[#fff7ec]">Self-taught</div>
          <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/58">Learned web development, AI, and deployment independently</p>
        </div>
        <div className="metric-card">
          <div className="font-display text-2xl sm:text-3xl text-[#fff7ec]">CS Student</div>
          <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/58">Studying Computer Science at NFC-IET, Multan</p>
        </div>
      </RevealSection>
    </section>
  )
}

async function TickerSection() {
  const { siteSettings } = await fetchCriticalData()
  const items = siteSettings.ticker_items.length > 0 ? siteSettings.ticker_items : fallbackSiteSettings.ticker_items

  return (
    <section className="ticker border-y border-white/10 py-3 sm:py-4">
      <div className="ticker__track">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-4 text-sm uppercase tracking-[0.28em] text-white/48">
            <span>{item}</span>
            <span className="text-[#5de2e7]">•</span>
          </div>
        ))}
      </div>
    </section>
  )
}

async function AboutSection() {
  const { timelineItems, skillCategories } = await fetchAllPortfolioData()
  const displayTimeline = timelineItems.length > 0 ? timelineItems : fallbackTimelineItems
  const displaySkills = skillCategories.length > 0 ? skillCategories : fallbackSkillCategories

  return (
    <RevealSection id="about" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
      <div className="max-w-3xl mb-8 sm:mb-12">
        <div className="eyebrow">My story</div>
        <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">Started recently. Already building things that work.</h2>
        <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
          No CS degree yet, no years of experience. Just obsessive learning, real projects shipped, and a track record that speaks faster than a resume.
        </p>
      </div>
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
          <div className="eyebrow mb-5 sm:mb-6">Learning timeline</div>
          <div className="space-y-5 sm:space-y-6">
            {displayTimeline.map((item) => (
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
            {displaySkills.map((cat) => (
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
  )
}

async function ProjectsSection() {
  const { projects } = await fetchAllPortfolioData()

  return (
    <RevealSection id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
      <div className="max-w-3xl">
        <div className="eyebrow">Real projects</div>
        <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">Everything here is built, shipped, or in active development.</h2>
        <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
          I don&apos;t show mockups. These are real things I have built. More coming as I keep shipping.
        </p>
      </div>

      <ProjectsListClient projects={projects} />
    </RevealSection>
  )
}

async function ServicesSection() {
  const { serviceShowcases, offerPackages } = await fetchAllPortfolioData()

  return (
    <RevealSection id="services" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
      <div className="max-w-3xl">
        <div className="eyebrow">What I offer</div>
        <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">I build two things: premium websites and smart chatbots.</h2>
        <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">
          Every project gets the same obsessive attention to detail. I work directly with you, no middlemen, no templates.
        </p>
      </div>

      <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 xl:grid-cols-2">
        {serviceShowcases.map((item, index) => (
          <div key={item.id} className="package-card rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6" style={accentStyle(item.accent)}>
            <div className="text-xs uppercase tracking-[0.28em] text-white/38">{item.eyebrow}</div>
            <h3 className="font-display mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl text-[#fff7ec]">{item.title}</h3>
            <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-7 text-white/62">{item.summary}</p>
            <p className="mt-3 sm:mt-5 text-xs sm:text-sm leading-5 sm:leading-6 text-white/52">{item.highlight}</p>
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
              {item.tags.map((tag) => (
                <span key={tag} className="offer-chip">{tag}</span>
              ))}
            </div>
            <div className="mt-6 sm:mt-8">
              {index === 0 ? <WebsiteDemoPreview /> : <ChatbotDemoPreview />}
            </div>
            <div className="mt-5 sm:mt-7 grid gap-3 sm:grid-cols-2">
              {item.deliverables.map((deliverable) => (
                <div key={deliverable} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/74">{deliverable}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {offerPackages.map((item) => (
          <div key={item.id} className="package-card rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5" style={accentStyle(item.accent)}>
            <div className="text-xs uppercase tracking-[0.24em] text-white/38">{item.family}</div>
            <h3 className="font-display mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl text-[#fff7ec]">{item.title}</h3>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/62">{item.pitch}</p>
            <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm text-white/55">
              <p>{item.bestFor}</p>
              <p>{item.timeline}</p>
            </div>
            <div className="mt-4 sm:mt-6 space-y-3">
              {item.deliverables.map((deliverable) => (
                <div key={deliverable} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/76">{deliverable}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

async function SkillsSection() {
  const { certificates } = await fetchAllPortfolioData()
  const featuredCerts = certificates.slice(0, 3)

  return (
    <RevealSection className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
          <div className="eyebrow">Skills & proof</div>
          <h2 className="font-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl text-[#fff7ec]">The stack behind the work.</h2>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-white/62">
            Every skill here has been used in a real project. Certificates back it up.
          </p>
          <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python', 'Supabase', 'Node.js', 'AI Automation'].map((skill) => (
              <span key={skill} className="offer-chip">{skill}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
          {featuredCerts.length > 0 ? featuredCerts.map((cert) => (
            cert.credential_url ? (
              <a key={cert.id} href={cert.credential_url} target="_blank" rel="noreferrer" className="glass-panel rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 text-center hover:bg-white/[0.05] transition cursor-pointer">
                <div className="text-xs uppercase tracking-[0.2em] text-white/38 mb-2">Certificate</div>
                <div className="font-display text-lg sm:text-xl text-[#fff7ec]">{cert.title}</div>
                <div className="mt-2 text-xs text-white/50">{cert.issuer}</div>
              </a>
            ) : (
              <div key={cert.id} className="glass-panel rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-white/38 mb-2">Certificate</div>
                <div className="font-display text-lg sm:text-xl text-[#fff7ec]">{cert.title}</div>
                <div className="mt-2 text-xs text-white/50">{cert.issuer}</div>
              </div>
            )
          )) : (
            <>
              <div className="glass-panel rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-white/38 mb-2">Certificate</div>
                <div className="font-display text-lg sm:text-xl text-[#fff7ec]">Web Dev</div>
                <div className="mt-2 text-xs text-white/50">FreeCodeCamp</div>
              </div>
              <div className="glass-panel rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-white/38 mb-2">Certificate</div>
                <div className="font-display text-lg sm:text-xl text-[#fff7ec]">Python</div>
                <div className="mt-2 text-xs text-white/50">Coursera</div>
              </div>
              <div className="glass-panel rounded-[1.5rem] sm:rounded-[1.85rem] p-4 sm:p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-white/38 mb-2">Certificate</div>
                <div className="font-display text-lg sm:text-xl text-[#fff7ec]">AI/ML</div>
                <div className="mt-2 text-xs text-white/50">DeepLearning.AI</div>
              </div>
            </>
          )}
        </div>
      </div>
    </RevealSection>
  )
}

async function ContactSection() {
  const { siteSettings, about } = await fetchCriticalData()

  return (
    <RevealSection id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-28">
      <div className="max-w-3xl mb-8 sm:mb-12">
        <div className="eyebrow">Get in touch</div>
        <h2 className="section-title font-display mt-4 sm:mt-6 text-[#fff7ec]">{siteSettings.contact_title}</h2>
        <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/62">{siteSettings.contact_subtitle}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        <ContactForm />
        <div className="space-y-6">
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
            <div className="eyebrow">Direct contact</div>
            <h3 className="font-display mt-4 text-2xl sm:text-3xl text-[#fff7ec]">Prefer to reach out directly?</h3>
            <p className="mt-3 text-sm sm:text-base leading-6 text-white/62">
              I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {about.email && (
                <a href={`mailto:${about.email}`} className="glow-button inline-flex text-sm px-5 py-2.5">Email me</a>
              )}
              {about.github_url && (
                <a href={about.github_url} target="_blank" rel="noreferrer" className="ghost-button inline-flex text-sm px-5 py-2.5">GitHub</a>
              )}
            </div>
          </div>
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
            <div className="eyebrow">Social links</div>
            <div className="mt-5 space-y-4">
              {about.github_url && (
                <a href={about.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 group-hover:bg-white/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.964 1.121.858-.24 1.786-.357 2.714-.357.927 0 1.855.117 2.714.357 1.956-1.443 2.964-1.121 2.964-1.121.652 1.652.24 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">GitHub</div>
                    <div className="text-xs text-white/50">{about.github_url.split('github.com/')[1] ? `@${about.github_url.split('github.com/')[1].replace('/', '')}` : 'Follow me'}</div>
                  </div>
                </a>
              )}
              {about.linkedin_url && (
                <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 group-hover:bg-white/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">LinkedIn</div>
                    <div className="text-xs text-white/50">Connect with me</div>
                  </div>
                </a>
              )}
              {about.twitter_url && (
                <a href={about.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 group-hover:bg-white/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Twitter</div>
                    <div className="text-xs text-white/50">{about.twitter_url.split('twitter.com/')[1] ? `@${about.twitter_url.split('twitter.com/')[1].replace('/', '')}` : 'Follow me'}</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  )
}

async function Footer() {
  const { about } = await fetchCriticalData()

  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 border-t border-white/10 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/48">Built with Next.js, Supabase, and a lot of late nights.</div>
        <div className="flex gap-4">
          {about.github_url && (
            <a href={about.github_url} target="_blank" rel="noreferrer" className="text-white/48 transition hover:text-white" aria-label="GitHub">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.964 1.121.858-.24 1.786-.357 2.714-.357.927 0 1.855.117 2.714.357 1.956-1.443 2.964-1.121 2.964-1.121.652 1.652.24 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

async function Header() {
  const { about } = await fetchCriticalData()

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5">
        <div className="glass-panel flex items-center justify-between rounded-full px-3 sm:px-4 py-2.5 sm:py-3 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-display text-sm sm:text-lg text-[#fff7ec]">{about.name?.split(' ')[0] || 'Muneeb'}</span>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-white/35 md:inline">Web Dev · AI Builder</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {about.github_url && (
              <a href={about.github_url} target="_blank" rel="noreferrer" className="text-white/50 transition hover:text-white" aria-label="GitHub profile">
                <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem]" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.964 1.121.858-.24 1.786-.357 2.714-.357.927 0 1.855.117 2.714.357 1.956-1.443 2.964-1.121 2.964-1.121.652 1.652.24 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
            <nav className="hidden items-center gap-6 text-sm text-white/62 lg:flex">
              <Link href="#about" className="transition hover:text-white">About</Link>
              <Link href="#projects" className="transition hover:text-white">Projects</Link>
              <Link href="#services" className="transition hover:text-white">Services</Link>
              <Link href="#contact" className="transition hover:text-white">Contact</Link>
            </nav>
            <Link href="#contact" className="glow-button hidden md:inline-flex text-sm px-4 py-2">Let&apos;s work together</Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <main className="page-shell relative overflow-x-clip pb-14">
      <AmbientSpotlight />
      <div className="site-grid" aria-hidden />
      <div className="hero-orbit hero-orbit-one" aria-hidden />
      <div className="hero-orbit hero-orbit-two" aria-hidden />
      <div className="hero-orbit hero-orbit-three" aria-hidden />

      <Header />

      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<TickerSkeleton />}>
        <TickerSection />
      </Suspense>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsSection />
      </Suspense>

      <Suspense fallback={<ContactSkeleton />}>
        <ContactSection />
      </Suspense>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </main>
  )
}