export class HarmoniumAudio {
  private audioCtx: AudioContext | null = null;
  private activeOscillators: Map<number, { oscillators: OscillatorNode[], gainNode: GainNode }> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private init() {
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNote(frequency: number, octaveShift: number = 0) {
    this.init();
    if (!this.audioCtx) return;

    const freq = frequency * Math.pow(2, octaveShift);
    
    // Stop existing note if playing
    this.stopNote(freq);

    const gainNode = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1, this.audioCtx.currentTime);

    const oscillators: OscillatorNode[] = [];

    // Layer 1: Sawtooth (Fundamental)
    const osc1 = this.audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    oscillators.push(osc1);

    // Layer 2: Square (Harmonics)
    const osc2 = this.audioCtx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    osc2.detune.setValueAtTime(5, this.audioCtx.currentTime); // Slight detune
    oscillators.push(osc2);

    // Layer 3: Sawtooth (Octave below for richness)
    const osc3 = this.audioCtx.createOscillator();
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(freq / 2, this.audioCtx.currentTime);
    osc3.detune.setValueAtTime(-5, this.audioCtx.currentTime);
    oscillators.push(osc3);

    oscillators.forEach(osc => {
      osc.connect(gainNode);
      osc.start();
    });

    gainNode.connect(filter);
    filter.connect(this.audioCtx.destination);

    // Envelope
    const now = this.audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05); // Soft attack

    this.activeOscillators.set(freq, { oscillators, gainNode });
  }

  stopNote(frequency: number, octaveShift: number = 0) {
    const freq = frequency * Math.pow(2, octaveShift);
    const active = this.activeOscillators.get(freq);
    if (active && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      active.gainNode.gain.cancelScheduledValues(now);
      active.gainNode.gain.setValueAtTime(active.gainNode.gain.value, now);
      active.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // Soft release
      
      setTimeout(() => {
        active.oscillators.forEach(osc => osc.stop());
        active.oscillators.forEach(osc => osc.disconnect());
        active.gainNode.disconnect();
        this.activeOscillators.delete(freq);
      }, 250);
    }
  }
}

export const harmoniumAudio = new HarmoniumAudio();
