'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
import { sounds } from '@/lib/sound'

const navItems = [
  { href: '#work', label: 'Projects', meta: 'Selected builds' },
  { href: '#services', label: 'Services', meta: 'What I ship' },
  { href: '#process', label: 'Process', meta: 'How it moves' },
  { href: '#about', label: 'About', meta: 'The studio note' },
  { href: '/resume', label: 'Resume', meta: 'Live CV & Credentials' },
]

export function SiteHeader() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggleAudio = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    sounds.toggleSound()
    if (next) sounds.playSuccess()
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#08090c]/90 border-b border-white/10 backdrop-blur-xl py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' 
        : 'bg-transparent border-b border-white/5 py-4.5'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Identity */}
        <Link 
          href="/" 
          onClick={() => sounds.playClick()}
          className="group flex items-center gap-2 sm:gap-3 min-w-0"
          aria-label="Muneeb Ur Rehman Home"
        >
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-[#ffd98c]/40 bg-black/80 shadow-[0_0_15px_rgba(255,217,140,0.2)] group-hover:border-[#ffd98c] group-hover:shadow-[0_0_22px_rgba(255,217,140,0.4)] transition-all overflow-hidden p-0.5">
            <Image
              src="/logo.png"
              alt="MR Brand Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <div className="min-w-0">
            <span className="block font-display text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[#ffd98c] transition-colors whitespace-nowrap">
              Muneeb Ur Rehman
            </span>
            <span className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-wider text-stone-400 whitespace-nowrap">
              Full-Stack &amp; AI
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md md:flex">
          {navItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              onClick={() => sounds.playTab()}
              className="rounded-full px-3.5 py-1.5 text-xs font-mono font-medium text-stone-300 hover:text-white hover:bg-white/10 transition-all"
              target={item.href.startsWith('/') ? '_blank' : undefined} 
              rel={item.href.startsWith('/') ? 'noreferrer' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            title={soundEnabled ? 'Mute interaction audio' : 'Enable interaction audio'}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 hover:border-[#ffd98c]/40 hover:text-[#ffd98c] transition-all"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ffd98c]" /> : <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-stone-500" />}
          </button>

          {/* Contact Button */}
          <a 
            href="#contact" 
            onClick={() => sounds.playClick()}
            className="relative inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#ffd98c]/50 bg-gradient-to-r from-[#ffd98c] via-[#f5c76d] to-[#e5b358] px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-mono font-bold !text-[#080706] shadow-[0_0_20px_rgba(255,217,140,0.25)] hover:shadow-[0_0_25px_rgba(255,217,140,0.45)] whitespace-nowrap transition-all hover:scale-105 active:scale-95"
          >
            <span className="font-bold !text-[#080706]">Let&apos;s Build</span>
            <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 !text-[#080706]" />
          </a>
        </div>
      </nav>
    </header>
  )
}
