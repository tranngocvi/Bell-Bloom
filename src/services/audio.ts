class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private openingAudio: HTMLAudioElement | null = null;
  private countdownAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.openingAudio = new Audio('/opening.mp3');
        this.openingAudio.preload = 'auto';
        this.countdownAudio = new Audio('/countdown15.mp3');
        this.countdownAudio.preload = 'auto';
      } catch (e) {
        console.warn('Audio elements init error:', e);
      }
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stopOpening();
      this.stopCountdown();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // 1. NHẠC MỞ ĐẦU (Opening.mp3)
  public playOpening() {
    if (!this.enabled) return;
    try {
      if (this.openingAudio) {
        this.openingAudio.currentTime = 0;
        this.openingAudio.play().catch((e) => console.log('Opening play error:', e));
      }
    } catch {
      // Ignore
    }
  }

  public stopOpening() {
    try {
      if (this.openingAudio) {
        this.openingAudio.pause();
        this.openingAudio.currentTime = 0;
      }
    } catch {
      // Ignore
    }
  }

  // 2. ÂM THANH BLING BLING KHI MỞ CÂU HỎI MỚI (Gameshow Sparkle Chime)
  public playNewQuestionBling() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Magic sparkle arpeggio: F#5 -> A#5 -> C#6 -> F#6 -> G#6
    const notes = [739.99, 932.33, 1108.73, 1479.98, 1661.22];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.3);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  // 3. ÂM THANH BLING BLING KHI CÔNG BỐ ĐÁP ÁN ĐÚNG (Celebration Victory Chime)
  public playBell() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // A. Big golden bell body
    const bellFreqs = [587.33, 1174.66, 1760.0, 2349.32]; // D5 and harmonics
    const bellWeights = [0.35, 0.22, 0.12, 0.05];

    bellFreqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(bellWeights[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    });

    // B. Shimmering bling bling sparkle cascade (D6 -> F#6 -> A6 -> D7)
    const blingNotes = [1174.66, 1479.98, 1760.0, 2349.32, 2959.96];
    blingNotes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = now + 0.08 + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // 4. NHẠC ĐẾM NGƯỢC 15 GIÂY CHÍNH THỨC (15 Seconds Countdown.mp3)
  public playCountdown() {
    if (!this.enabled) return;
    try {
      if (this.countdownAudio) {
        this.countdownAudio.currentTime = 0;
        this.countdownAudio.play().catch((e) => console.log('Countdown play error:', e));
      }
    } catch {
      // Ignore
    }
  }

  public pauseCountdown() {
    try {
      if (this.countdownAudio) {
        this.countdownAudio.pause();
      }
    } catch {
      // Ignore
    }
  }

  public resumeCountdown() {
    if (!this.enabled) return;
    try {
      if (this.countdownAudio) {
        this.countdownAudio.play().catch((e) => console.log('Countdown resume error:', e));
      }
    } catch {
      // Ignore
    }
  }

  public stopCountdown() {
    try {
      if (this.countdownAudio) {
        this.countdownAudio.pause();
        this.countdownAudio.currentTime = 0;
      }
    } catch {
      // Ignore
    }
  }

  public playStart() {
    this.playCountdown();
  }

  public playCountdownTick(_secondsLeft?: number) {
    // Handled by countdown15.mp3
  }

  // 5. TIẾNG CÒI BÁO HẾT GIỜ (Dừng bút giơ bảng)
  public playTimeout() {
    if (!this.enabled) return;
    this.stopCountdown();
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  // 6. ÂM CHIẾN THẮNG KẾT THÚC
  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.5, d: 0.5 },
    ];

    let t = this.ctx.currentTime;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.d);
      t += n.d + 0.03;
    });
  }
}

export const soundManager = new SoundEffects();
