'use client'

import Link from 'next/link'
import { useState } from 'react'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="brand-mark" aria-label="Muneeb Ur Rehman home">
          <span className="brand-mark__symbol">MR</span>
          <span className="hidden md:block" style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>Muneeb</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm text-stone-300/80 md:flex">
          <a href="#work" className="nav-link">Work</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#process" className="nav-link">Process</a>
          <a href="#about" className="nav-link">About</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#contact" className="button button--small px-3 sm:px-4">
            Start a project
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
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