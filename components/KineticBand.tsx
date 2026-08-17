'use client'

import { motion } from 'motion/react'

const ITEMS = [
  'PREMIUM WEBSITES', 
  'AI CHATBOTS', 
  'CONVERSION SYSTEMS', 
  'FAST TURNAROUNDS', 
  'SUPABASE CLOUD CMS', 
  'NEXT.JS 15 APP ROUTER', 
  'WEB AUDIO API',
  'DETERMINISTIC WORKFLOWS'
]

export function KineticBand() {
  // 4 duplicates to guarantee seamless infinite loop regardless of screen width
  const track = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div 
      className="relative w-full overflow-hidden border-y border-white/10 bg-black/90 py-3.5 sm:py-4.5 backdrop-blur-xl select-none z-10" 
      aria-hidden="true"
    >
      {/* Left/Right Vignette Fades for cinematic seamless edge blending */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#08090c] to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#08090c] to-transparent z-20" />

      <motion.div
        className="flex w-max items-center gap-0 cursor-default"
        animate={{
          x: ['0%', '-50%']
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 30
        }}
        whileHover={{
          animationPlayState: 'paused'
        }}
      >
        {track.map((item, index) => (
          <div 
            key={`${item}-${index}`} 
            className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-stone-300 whitespace-nowrap"
          >
            <span className="text-[#ffd98c] drop-shadow-[0_0_8px_rgba(255,217,140,0.6)]">✦</span>
            <span className="hover:text-white transition-colors">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
