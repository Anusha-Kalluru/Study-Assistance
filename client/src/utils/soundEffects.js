// Web Audio API Synthesizer for zero-dependency study sound effects

class SoundEffects {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playFlip() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio playback quiet fail
    }
  }

  playMastered() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch (e) {
      // Audio playback quiet fail
    }
  }

  playReview() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio playback quiet fail
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {
      // Audio playback quiet fail
    }
  }
}

export const soundManager = new SoundEffects();
