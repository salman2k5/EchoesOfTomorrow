// Web Audio API pure synthesis for cinematic atmosphere & micro-interactions

class AudioManager {
  private ctx: AudioContext | null = null
  private droneGain: GainNode | null = null
  private isMuted: boolean = true
  private isInitialized: boolean = false
  private lastTickTime: number = 0

  private initContext() {
    if (this.ctx) return
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      this.ctx = new AudioContextClass()
    }
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public toggleMute(): boolean {
    this.initContext()
    if (!this.ctx) return true

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.isMuted = !this.isMuted

    if (!this.isInitialized && !this.isMuted) {
      this.startAmbientDrone()
      this.isInitialized = true
    } else if (this.droneGain) {
      const now = this.ctx.currentTime
      if (this.isMuted) {
        this.droneGain.gain.setTargetAtTime(0.0001, now, 0.4)
      } else {
        this.droneGain.gain.setTargetAtTime(0.08, now, 0.4)
      }
    }

    return this.isMuted
  }

  private startAmbientDrone() {
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const master = this.ctx.createGain()
      master.gain.setValueAtTime(0.0001, now)
      master.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.08, now + 3)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(160, now)

      // Sub-bass fundamental (48Hz)
      const osc1 = this.ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(48, now)

      // Ethereal overtone (96.4Hz with slow binaural beating)
      const osc2 = this.ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(96.4, now)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(master)
      master.connect(this.ctx.destination)

      osc1.start()
      osc2.start()

      this.droneGain = master
    } catch {
      // Audio autoplay policy or device restriction
    }
  }

  public playHover() {
    if (this.isMuted || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06)

      gain.gain.setValueAtTime(0.015, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)
    } catch {
      // Ignore
    }
  }

  public playEnter() {
    if (this.isMuted || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(64, now)
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.8)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, now)
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.6)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 1.25)
    } catch {
      // Ignore
    }
  }

  public playTick() {
    if (this.isMuted || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      if (now - this.lastTickTime < 0.04) return
      this.lastTickTime = now

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.035)
    } catch {
      // Ignore
    }
  }

  public playShift() {
    if (this.isMuted || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(450, now)
      filter.Q.setValueAtTime(4, now)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.24)
    } catch {
      // Ignore
    }
  }
}

export const audioManager = new AudioManager()
