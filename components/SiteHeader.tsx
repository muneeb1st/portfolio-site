'use client'

import Link from 'next/link'

const navItems = [
  { href: '#work', label: 'Work', meta: 'Selected builds' },
  { href: '#services', label: 'Services', meta: 'What I ship' },
  { href: '#process', label: 'Process', meta: 'How it moves' },
  { href: '#about', label: 'About', meta: 'The studio note' },
]

const mobileNavItems = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__nav mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="brand-mark" aria-label="Muneeb Ur Rehman home">
          <span className="brand-mark__symbol">MR</span>
          <span className="brand-mark__name">Muneeb</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm text-stone-300/80 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">{item.label}</a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a href="#contact" className="button button--small">
            Start a project
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-inline-nav" aria-label="Mobile navigation">
          {mobileNavItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </div>

        <a href="#contact" className="mobile-icon-link" aria-label="Contact Muneeb">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v2.25M12 18.75V21M3 12h2.25M18.75 12H21M5.64 5.64l1.6 1.6M16.76 16.76l1.6 1.6M18.36 5.64l-1.6 1.6M7.24 16.76l-1.6 1.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="3.45" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </a>
      </nav>
    </header>
  )
}
