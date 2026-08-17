// Web Audio API Synthesizer for high-end micro-interactions and terminal feedback

class SoundSynthesizer {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  private initCtx() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled
    return this.enabled
  }

  public isSoundEnabled(): boolean {
    return this.enabled
  }

  public playClick() {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playHover() {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(520, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(680, ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playTab() {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch {
      // Audio policy
    }
  }

  public playSuccess() {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      osc1.frequency.setValueAtTime(587.33, now) // D5
      osc1.frequency.setValueAtTime(880, now + 0.08) // A5

      osc2.frequency.setValueAtTime(739.99, now) // F#5
      osc2.frequency.setValueAtTime(1174.66, now + 0.08) // D6

      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.25)
      osc2.stop(now + 0.25)
    } catch {
      // Audio policy
    }
  }

  public playModal() {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // Audio policy
    }
  }
}

export const sounds = new SoundSynthesizer()
