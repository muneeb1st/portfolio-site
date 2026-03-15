'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

// Animated wrapper components
function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div ref={ref} className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  )
}

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div 
      ref={ref} 
      className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Typing animation component
function TypingAnimation({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text])

  return (
    <span>
      {displayText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </span>
  )
}

// Project Modal Component
function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Image */}
        {project.image_url && (
          <div className="w-full h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-purple-100 to-pink-100">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Modal Content */}
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="float-right text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>

          {/* Project Title */}
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            {project.title}
          </h2>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.isArray(project.technologies) && project.technologies.map((tech: string, i: number) => (
              <span 
                key={tech} 
                className="px-4 py-2 text-sm font-medium rounded-full text-white"
                style={{
                  background: `linear-gradient(135deg, ${['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#f472b6'][i % 5]} 0%, ${['#c084fc', '#f472b6', '#60a5fa', '#a78bfa', '#f9a8d4'][i % 5]} 100%)`
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">About This Project</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.demo_url && (
              <a 
                href={project.demo_url} 
                target="_blank" 
                className="flex-1 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                🚀 Live Demo
              </a>
            )}
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                className="flex-1 text-center border-2 border-purple-500 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all"
              >
                💻 View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
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
  image_url: string | null
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [aboutData, setAboutData] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactStatus, setContactStatus] = useState('')

  useEffect(() => {
    async function fetchData() {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true })
      
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('*')
        .order('order', { ascending: true })
      
      const { data: about } = await supabase
        .from('about')
        .select('*')
        .single()
      
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('order_num', { ascending: true })
      
      setProjects(projectsData || [])
      setCertificates(certificatesData || [])
      setAboutData(about)
      setSkills(skillsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactSubmitting(true)
    setContactStatus('')

    const { error } = await supabase
      .from('contact_messages')
      .insert([contactForm])

    if (error) {
      setContactStatus('Failed to send message. Please try again.')
    } else {
      setContactStatus('Message sent successfully! I\'ll get back to you soon.')
      setContactForm({ name: '', email: '', message: '' })
    }

    setContactSubmitting(false)
  }

  const featuredProjects = projects.filter(p => p.featured)
  const regularProjects = projects.filter(p => !p.featured)

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          {aboutData?.profile_image_url && (
            <img 
              src={aboutData.profile_image_url} 
              alt={aboutData.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl object-cover animate-fade-in"
            />
          )}
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            {aboutData?.name ? (
              <>Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                {aboutData.name}
              </span></>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </h1>
          <p className="text-2xl text-white/90 mb-8 animate-fade-in-delay">
            {aboutData?.tagline ? (
              <TypingAnimation text={aboutData.tagline} />
            ) : (
              <TypingAnimation text="Full Stack Developer | Building Amazing Web Experiences" />
            )}
          </p>
          
          {(aboutData?.github_url || aboutData?.linkedin_url || aboutData?.twitter_url) && (
            <div className="flex gap-4 justify-center mb-8 animate-fade-in-delay">
              {aboutData.github_url && (
                <a href={aboutData.github_url} target="_blank" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full transition-all">
                  GitHub
                </a>
              )}
              {aboutData.linkedin_url && (
                <a href={aboutData.linkedin_url} target="_blank" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full transition-all">
                  LinkedIn
                </a>
              )}
              {aboutData.twitter_url && (
                <a href={aboutData.twitter_url} target="_blank" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full transition-all">
                  Twitter
                </a>
              )}
            </div>
          )}
          
          <div className="flex gap-4 justify-center animate-fade-in-delay-2">
            <a href="#projects" className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg">
              View My Work
            </a>
            <a href="#contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About & Skills Section */}
      {aboutData?.bio && (
        <AnimatedSection>
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aboutData.bio}
                </p>
              </div>

              {skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                    Skills
                  </h2>
                  <div className="space-y-3">
                    {skills.map((skill: any, index: number) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700">{skill.name}</span>
                          {skill.category && (
                            <span className="text-sm text-gray-500">{skill.category}</span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${skill.proficiency * 10}%`,
                              background: `linear-gradient(90deg, ${['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][index % 5]} 0%, ${['#c084fc', '#f472b6', '#60a5fa', '#34d399', '#fbbf24'][index % 5]} 100%)`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="max-w-7xl mx-auto px-6 py-20">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-600 text-lg">Check out my best work</p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <AnimatedCard key={project.id} delay={index * 100}>
                <div 
                  className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

                  {project.image_url && (
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-2xl">⭐</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(project.technologies) && project.technologies.map((tech: string, i: number) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 text-sm font-medium rounded-full transition-all hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#f472b6'][i % 5]} 0%, ${['#c084fc', '#f472b6', '#60a5fa', '#a78bfa', '#f9a8d4'][i % 5]} 100%)`,
                            color: 'white'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          className="flex-1 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                          Live Demo →
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          className="flex-1 text-center border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:border-purple-500 hover:text-purple-600 transition-all"
                        >
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {regularProjects.length > 0 && (
        <AnimatedSection>
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                More Projects
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project: any) => (
                <div 
                  key={project.id} 
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.image_url && (
                    <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) && project.technologies.map((tech: string, i: number) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 text-sm font-medium rounded-full text-white transition-all hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][i % 5]} 0%, ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'][i % 5]} 100%)`
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {(project.demo_url || project.github_url) && (
                      <div className="flex gap-2 mt-4">
                        {project.demo_url && (
                          <a 
                            href={project.demo_url} 
                            target="_blank" 
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Demo →
                          </a>
                        )}
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                          >
                            Code →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <AnimatedSection>
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-blue-600 mb-4">
                Certificates & Achievements
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <div 
                  key={cert.id} 
                  className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden group"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{background: `linear-gradient(135deg, ${['#a855f7', '#ec4899', '#3b82f6'][index % 3]} 0%, ${['#c084fc', '#f472b6', '#60a5fa'][index % 3]} 100%)`}}
                  ></div>
                  
                  <div className="relative">
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
                    <p className="text-gray-600 font-medium mb-2">{cert.issuer}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(cert.issue_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    
                    {cert.credential_url && (
                      <a 
                        href={cert.credential_url} 
                        target="_blank" 
                        className="inline-block text-purple-600 hover:text-pink-600 font-medium text-sm transition-colors"
                      >
                        View Credential →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Contact Form */}
      <AnimatedSection>
        <section id="contact" className="max-w-4xl mx-auto px-6 py-20">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                Let's Work Together
              </h2>
              <p className="text-gray-600 text-lg">
                Have a project in mind? Drop me a message!
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              {contactStatus && (
                <div className={`p-4 rounded-xl text-center font-medium ${
                  contactStatus.includes('successfully') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {contactStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={contactSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 hover:scale-[1.02]"
              >
                {contactSubmitting ? 'Sending...' : 'Send Message 🚀'}
              </button>
            </form>
          </div>
        </section>
      </AnimatedSection>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/80">© 2026 {aboutData?.name || 'Your Name'}. Built with Next.js & Supabase</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.2s backwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s backwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .scroll-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .typing-cursor {
          animation: blink 1s infinite;
          margin-left: 2px;
        }
      `}</style>
    </main>
  )
}