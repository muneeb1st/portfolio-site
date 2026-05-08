'use client'

import Link from 'next/link'
import { useState } from 'react'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="brand-mark" aria-label="Muneeb Ur Rehman home">
          <span className="brand-mark__symbol">MR</span>
          <span className="brand-name" style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>Muneeb</span>
        </Link>

        {/* Navigation - visible on larger mobile screens */}
        <div className="nav-links-container hidden min-[480px]:flex min-[480px]:flex-1 min-[480px]:justify-center min-[480px]:gap-3 min-[480px]:text-xs min-[768px]:gap-6 min-[768px]:text-sm">
          <a href="#work" className="nav-link whitespace-nowrap">Work</a>
          <a href="#services" className="nav-link whitespace-nowrap">Services</a>
          <a href="#process" className="nav-link whitespace-nowrap">Process</a>
          <a href="#about" className="nav-link whitespace-nowrap">About</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:ml-auto">
          <a href="#contact" className="button button--small px-3 sm:px-4">
            <span className="sm:hidden">Hire me</span>
            <span className="hidden sm:inline">Start a project</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="p-2 rounded-full hover:bg-white/5 transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 mx-4 p-4 rounded-2xl border border-white/10" style={{ background: 'rgba(24, 22, 18, 0.98)', backdropFilter: 'blur(12px)' }}>
            <div className="flex flex-col gap-3">
              <a href="#work" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Work</a>
              <a href="#services" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#process" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Process</a>
              <a href="#about" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}