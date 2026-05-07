'use client'

import Link from 'next/link'
import { useState } from 'react'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="brand-mark" aria-label="Muneeb Ur Rehman home" data-magnetic>
          <span className="brand-mark__symbol">MR</span>
          <span className="hidden sm:block">Muneeb Ur Rehman</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm text-stone-300/80 md:flex">
          <Link href="#work" className="nav-link">Work</Link>
          <Link href="#services" className="nav-link">Services</Link>
          <Link href="#process" className="nav-link">Process</Link>
          <Link href="#about" className="nav-link">About</Link>
        </div>

        {/* Desktop CTA */}
        <Link href="#contact" className="hidden md:inline-flex button button--small" data-magnetic>
          BOOK A BUILD
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-stone-300" fill="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 mx-4 p-4 rounded-2xl border border-white/10" style={{ background: 'rgba(24, 22, 18, 0.95)', backdropFilter: 'blur(12px)' }}>
            <div className="flex flex-col gap-4">
              <Link href="#work" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Work</Link>
              <Link href="#services" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="#process" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>Process</Link>
              <Link href="#about" className="nav-link text-base py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="#contact" className="button button--small text-center mt-2" data-magnetic onClick={() => setMobileMenuOpen(false)}>
                BOOK A BUILD
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}