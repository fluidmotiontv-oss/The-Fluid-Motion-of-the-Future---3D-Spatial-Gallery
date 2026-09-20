/**
 * Spatial Audio Engine utilizing Web Audio API for zero-asset, procedural atmospheric soundscapes.
 * Provides generative ambient pads, room transition chimes, and interaction feedback.
 */

class FrequencyHealer {
  private ctx: AudioContext;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private masterGain: GainNode;

  constructor(audioContext: AudioContext, masterGain: GainNode) {
    this.ctx = audioContext;
    this.masterGain = masterGain;
  }

  public playTone(frequency: number, type: OscillatorType = 'sine', gainValue: number = 0.1) {
    this.stop();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();

    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    this.gainNode.gain.setValueAtTime(gainValue, this.ctx.currentTime);

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.masterGain);

    this.oscillator.start();
  }

  public stop() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {
        // Already stopped
      }
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}

class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  
  // Audio Nodes
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private frequencyHealer: FrequencyHealer | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Lowpass filter for smooth ambient warmth
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);
      this.filterNode.connect(this.masterGain);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.droneGain.connect(this.filterNode);

      this.frequencyHealer = new FrequencyHealer(this.ctx, this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startAtmosphere() {
    this.initContext();
    if (!this.ctx || this.isPlaying) return;

    try {
      this.stopAtmosphere();

      // Create warm generative chord (C - G - D - A ambient fifths stack)
      const baseFreq = 65.41; // C2
      const freqs = [
        baseFreq,          // C2 (Sub warmth)
        baseFreq * 1.498,  // G2 (Fifth)
        baseFreq * 2.25,   // D3 (Ninth)
        baseFreq * 3.375,  // A3 (Major sixth sheen)
        baseFreq * 4.0,    // C4 (High harmonic)
      ];

      this.oscillators = freqs.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        // Alternate waveforms for rich spatial texture
        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        
        // Gentle subtle detune for shimmering chorus
        const detuneAmount = (idx - 2) * 4.5;
        osc.detune.setValueAtTime(detuneAmount, this.ctx!.currentTime);

        const gainVal = idx === 0 ? 0.4 : 0.15 / (idx + 0.5);
        oscGain.gain.setValueAtTime(gainVal, this.ctx!.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.droneGain!);
        osc.start();
        return osc;
      });

      // LFO for slow breathing filter sweep (54-second period inspired by Dragon9)
      this.lfoNode = this.ctx.createOscillator();
      this.lfoNode.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ~12s cycle
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      
      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode!.frequency);
      this.lfoNode.start();

      this.isPlaying = true;
    } catch {
      // Graceful fallback
    }
  }

  public stopAtmosphere() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    });
    this.oscillators = [];

    if (this.lfoNode) {
      try {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      } catch {
        // Ignored
      }
      this.lfoNode = null;
    }
    this.isPlaying = false;
  }

  public setRoomMood(roomId: string) {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    
    // Adjust cutoff frequency and resonance based on room atmosphere
    switch (roomId) {
      case 'foyer':
        this.filterNode.frequency.setTargetAtTime(650, now, 1.2);
        break;
      case 'hall1':
        this.filterNode.frequency.setTargetAtTime(950, now, 1.2);
        break;
      case 'hall2':
        this.filterNode.frequency.setTargetAtTime(800, now, 1.2);
        break;
      case 'lotus':
        this.filterNode.frequency.setTargetAtTime(1100, now, 1.0);
        break;
      case 'lounge':
        this.filterNode.frequency.setTargetAtTime(500, now, 1.5);
        break;
      case 'games':
        this.filterNode.frequency.setTargetAtTime(1400, now, 0.8);
        break;
      case 'theater':
        this.filterNode.frequency.setTargetAtTime(450, now, 1.5);
        break;
      case 'skatepark':
        this.filterNode.frequency.setTargetAtTime(1250, now, 1.0);
        break;
      case 'waterworld':
        this.filterNode.frequency.setTargetAtTime(1000, now, 1.2);
        break;
      case 'vault':
        this.filterNode.frequency.setTargetAtTime(1200, now, 1.0);
        break;
    }
  }

  public playHealerTone(freq: number, type: OscillatorType = 'sine', gain: number = 0.1) {
    this.initContext();
    if (this.frequencyHealer && !this.isMuted) {
      this.frequencyHealer.playTone(freq, type, gain);
    }
  }

  public stopHealerTone() {
    if (this.frequencyHealer) {
      this.frequencyHealer.stop();
    }
  }

  public playSynthNote(freq: number = 440) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // Ignored
    }
  }

  public playRoomTransition() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Harmonic whoosh sweep upward
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.6); // D5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch {
      // Ignored
    }
  }

  public playInteractSound(type: 'click' | 'portal' | 'shimmer' | 'purchase') {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'portal') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.4); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'shimmer' || type === 'purchase') {
        // High crystalline chime chord (A major triad)
        [880, 1108.73, 1318.51, 1760].forEach((f, i) => {
          const chimeOsc = this.ctx!.createOscillator();
          const chimeGain = this.ctx!.createGain();
          chimeOsc.type = 'sine';
          chimeOsc.frequency.setValueAtTime(f, now + i * 0.04);
          
          chimeGain.gain.setValueAtTime(0.001, now + i * 0.04);
          chimeGain.gain.linearRampToValueAtTime(0.12 / (i + 1), now + i * 0.04 + 0.05);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(this.masterGain!);
          chimeOsc.start(now + i * 0.04);
          chimeOsc.stop(now + 1.3);
        });
      }
    } catch {
      // Ignored
    }
  }

  public playIntermissionAlert() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Dissonant then resolving pair of notes (Eb5 -> C5)
      [622.25, 523.25].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.4);
        
        gain.gain.setValueAtTime(0, now + i * 0.4);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.4 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.9);
      });
    } catch {
      // Ignored
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime, 0.1);
    }
    if (!this.isPlaying && !this.isMuted) {
      this.startAtmosphere();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const spatialAudio = new SpatialAudioEngine();
