'use client'

import Link from 'next/link'

const navItems = [
  { href: '#work', label: 'Work', meta: 'Selected builds' },
  { href: '#services', label: 'Services', meta: 'What I ship' },
  { href: '#process', label: 'Process', meta: 'How it moves' },
  { href: '#about', label: 'About', meta: 'The studio note' },
  { href: '/resume.html', label: 'Resume', meta: 'Download CV' },
]

const mobileNavItems = [
  { href: '#work', label: 'Work' },
  { href: '/resume.html', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__nav mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="brand-mark" aria-label="MR Muneeb home">
          <span className="brand-mark__symbol">MR</span>
          <span className="brand-mark__name">Muneeb</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm text-stone-300/80 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" target={item.href.startsWith('/') ? '_blank' : undefined} rel={item.href.startsWith('/') ? 'noreferrer' : undefined}>{item.label}</a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a href="#contact" className="button button--small">
            Contact me
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-inline-nav" aria-label="Mobile navigation">
          {mobileNavItems.map((item) => (
            <a key={item.href} href={item.href} target={item.href.startsWith('/') ? '_blank' : undefined} rel={item.href.startsWith('/') ? 'noreferrer' : undefined}>{item.label}</a>
          ))}
        </div>
      </nav>
    </header>
  )
}
