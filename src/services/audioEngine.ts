/**
 * Aeon — The Living Symphony of Earth
 * Procedural Generative Audio Engine
 *
 * Built directly on Web Audio API + Tone.js principles.
 * Completely procedural: NO looped audio files, NO static mp3s.
 * Every harmonic, sub-bass tremor, chime, and atmospheric swell is synthesized in real time.
 */

import { WorldParameters, LocalFrequencyData, FrequencyLayerState, FrequencyPreset } from '../types';
import { mapWorldToMusicalParameters, MusicalParameters, interpolateParameters } from '../lib/mapping';

export class EarthAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Synthesis nodes
  // 1. Drone cluster (fundamental, fifth, octave, shimmer)
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneOsc3: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  // 2. Sub-bass seismic rumble
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private subLfo: OscillatorNode | null = null;
  private subLfoGain: GainNode | null = null;

  // 3. Atmospheric wind / pink noise
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 4. Space / Reverb & Delay
  private convolver: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private reverbWetGain: GainNode | null = null;

  // 5. My Frequency (Local texture layer)
  private myFreqGain: GainNode | null = null;
  private myFreqOsc1: OscillatorNode | null = null;
  private myFreqOsc2: OscillatorNode | null = null;
  private myFreqFilter: BiquadFilterNode | null = null;
  private myFreqEnabled: boolean = false;
  private currentLocalData: LocalFrequencyData | null = null;

  // 6. Pure Frequency Bed & Stress Regulation Dual Layer (Section 3B)
  private pureToneOsc: OscillatorNode | null = null;
  private pureToneGain: GainNode | null = null;
  private stressOsc1: OscillatorNode | null = null; // 396 Hz (tension release)
  private stressOsc2: OscillatorNode | null = null; // 528 Hz (calm/positivity)
  private stressGain: GainNode | null = null;
  private stressLfo: OscillatorNode | null = null; // 0.166 Hz (~6s breathing LFO)
  private stressLfoGain: GainNode | null = null;
  private frequencyLayerState: FrequencyLayerState = {
    preset: 'none',
    hz: 0,
    gain: 0.12,
    hapticSync: true,
    stressRegulation: false,
  };
  private stressHapticInterval: number | null = null;

  // Generative chime sequencing timer
  private chimeTimer: number | null = null;

  // Current and target parameters for smooth interpolation
  private currentParams: WorldParameters;
  private targetParams: WorldParameters;
  private currentMusicalParams: MusicalParameters;

  // Breath mode modulation
  private breathModeActive: boolean = false;
  private breathEnvelopeGain: GainNode | null = null;

  constructor() {
    // Initial standard baseline parameters
    this.currentParams = {
      timestamp: new Date().toISOString(),
      weatherVolatility: 0.42,
      marketVolatility: 0.35,
      newsSentiment: 0.18,
      seismicActivity: 0.28,
      terminatorPhase: 0.62,
    };
    this.targetParams = { ...this.currentParams };
    this.currentMusicalParams = mapWorldToMusicalParameters(this.currentParams);
  }

  /**
   * Initializes and starts the Web Audio graph on user gesture
   */
  public async start(): Promise<boolean> {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.buildAudioGraph();
      this.isRunning = true;
      this.startChimeGenerator();
      this.applyMusicalParameters(this.currentMusicalParams);
      return true;
    } catch (err) {
      console.warn('Audio start failed or blocked by policy:', err);
      return false;
    }
  }

  /**
   * Constructs the synthetic nodes, atmospheric buffers, and reverb impulse
   */
  private buildAudioGraph(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master Output & Analyser for visualizer
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, now);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.85;

    // Breath Envelope Gain (multiplied into master signal)
    this.breathEnvelopeGain = ctx.createGain();
    this.breathEnvelopeGain.gain.setValueAtTime(1.0, now);

    // Reverb: Algorithmic Cosmic Shimmer Impulse
    this.convolver = ctx.createConvolver();
    this.convolver.buffer = this.generateCosmicImpulse(ctx, 4.5, 2.8);
    this.reverbWetGain = ctx.createGain();
    this.reverbWetGain.gain.setValueAtTime(0.48, now);

    // Stereo-like ping pong delay for celestial space
    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.48, now);
    this.delayFeedback = ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.38, now);

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Connect Reverb & Delay to Breath Gain
    this.convolver.connect(this.reverbWetGain);
    this.reverbWetGain.connect(this.breathEnvelopeGain);
    this.delayNode.connect(this.breathEnvelopeGain);

    // 1. DRONE CLUSTER (Multi-voice harmonic warm pads)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.32, now);

    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(800, now);
    this.droneFilter.Q.setValueAtTime(1.5, now);

    // Fundamental D2 (73.42 Hz)
    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(73.42, now);

    // Fifth A2 (110 Hz) with soft detune for celestial chorusing
    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(110.0, now);
    this.droneOsc2.detune.setValueAtTime(4.2, now);

    // Octave D3 (146.83 Hz) with subtle slow detune
    this.droneOsc3 = ctx.createOscillator();
    this.droneOsc3.type = 'sine';
    this.droneOsc3.frequency.setValueAtTime(146.83, now);
    this.droneOsc3.detune.setValueAtTime(-3.8, now);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneOsc3.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);

    this.droneGain.connect(this.breathEnvelopeGain);
    this.droneGain.connect(this.convolver);

    this.droneOsc1.start();
    this.droneOsc2.start();
    this.droneOsc3.start();

    // 2. SUB-BASS SEISMIC TECTONIC PULSE
    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.42, now);

    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(43.65, now); // ~F0

    // Tremolo LFO for low-end seismic pressure breathing
    this.subLfo = ctx.createOscillator();
    this.subLfo.type = 'sine';
    this.subLfo.frequency.setValueAtTime(0.8, now);

    this.subLfoGain = ctx.createGain();
    this.subLfoGain.gain.setValueAtTime(0.15, now);

    this.subLfo.connect(this.subLfoGain);
    this.subLfoGain.connect(this.subGain.gain);

    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.breathEnvelopeGain);

    this.subOsc.start();
    this.subLfo.start();

    // 3. ATMOSPHERIC WIND NOISE (Generated Pink Noise buffer)
    const noiseBuffer = this.generatePinkNoiseBuffer(ctx, 4);
    this.noiseNode = ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(650, now);
    this.noiseFilter.Q.setValueAtTime(2.0, now);

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.04, now);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.breathEnvelopeGain);
    this.noiseGain.connect(this.convolver);

    this.noiseNode.start();

    // 4. MY FREQUENCY PERSONAL LAYER
    this.myFreqGain = ctx.createGain();
    this.myFreqGain.gain.setValueAtTime(0.0, now); // initial 0 until toggled

    this.myFreqFilter = ctx.createBiquadFilter();
    this.myFreqFilter.type = 'lowpass';
    this.myFreqFilter.frequency.setValueAtTime(1200, now);

    this.myFreqOsc1 = ctx.createOscillator();
    this.myFreqOsc1.type = 'sine';
    this.myFreqOsc1.frequency.setValueAtTime(220, now);

    this.myFreqOsc2 = ctx.createOscillator();
    this.myFreqOsc2.type = 'triangle';
    this.myFreqOsc2.frequency.setValueAtTime(330, now);

    this.myFreqOsc1.connect(this.myFreqFilter);
    this.myFreqOsc2.connect(this.myFreqFilter);
    this.myFreqFilter.connect(this.myFreqGain);
    this.myFreqGain.connect(this.breathEnvelopeGain);
    this.myFreqGain.connect(this.convolver);

    this.myFreqOsc1.start();
    this.myFreqOsc2.start();

    // 6. PURE FREQUENCY OSCILLATOR BED (Section 3B: dedicated oscillator at exact target Hz)
    this.pureToneGain = ctx.createGain();
    this.pureToneGain.gain.setValueAtTime(0.0001, now);

    this.pureToneOsc = ctx.createOscillator();
    this.pureToneOsc.type = 'sine';
    this.pureToneOsc.frequency.setValueAtTime(this.frequencyLayerState.hz || 528, now);
    this.pureToneOsc.connect(this.pureToneGain);
    this.pureToneGain.connect(this.masterGain);
    this.pureToneOsc.start();

    // 7. STRESS-REGULATION DUAL TONE OSCILLATORS (hz_396 under hz_528 with 6s LFO breathing pace)
    this.stressGain = ctx.createGain();
    this.stressGain.gain.setValueAtTime(0.0001, now);

    this.stressOsc1 = ctx.createOscillator();
    this.stressOsc1.type = 'sine';
    this.stressOsc1.frequency.setValueAtTime(396, now); // 396 Hz - tension release

    this.stressOsc2 = ctx.createOscillator();
    this.stressOsc2.type = 'sine';
    this.stressOsc2.frequency.setValueAtTime(528, now); // 528 Hz - calm/positivity

    // 6.0s cycle (~0.1667 Hz) LFO for gentle breath modulation
    this.stressLfo = ctx.createOscillator();
    this.stressLfo.type = 'sine';
    this.stressLfo.frequency.setValueAtTime(1 / 6.0, now);

    this.stressLfoGain = ctx.createGain();
    this.stressLfoGain.gain.setValueAtTime(0.04, now);

    this.stressLfo.connect(this.stressLfoGain);
    this.stressLfoGain.connect(this.stressGain.gain);

    this.stressOsc1.connect(this.stressGain);
    this.stressOsc2.connect(this.stressGain);
    this.stressGain.connect(this.masterGain);

    this.stressOsc1.start();
    this.stressOsc2.start();
    this.stressLfo.start();

    // Apply any initial frequency layer state
    if (this.frequencyLayerState.preset !== 'none' || this.frequencyLayerState.stressRegulation) {
      this.setFrequencyLayer(this.frequencyLayerState);
    }

    // Connect Breath Envelope to Master -> Analyser -> Destination
    this.breathEnvelopeGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);
  }

  /**
   * Periodically triggers generative celestial chime arpeggios in harmony
   */
  private startChimeGenerator(): void {
    if (this.chimeTimer) window.clearTimeout(this.chimeTimer);

    const scheduleNextChime = () => {
      if (!this.isRunning || !this.ctx) return;

      this.triggerGenerativeChime();

      // Next chime interval governed by rhythmic density / market volatility
      const intervalSec = this.currentMusicalParams.rhythmicDensityInterval;
      // Add small organic humanization jitter (+/- 25%)
      const jitter = (Math.random() - 0.5) * 0.5 * intervalSec;
      const nextMs = Math.max(1200, (intervalSec + jitter) * 1000);

      this.chimeTimer = window.setTimeout(scheduleNextChime, nextMs);
    };

    scheduleNextChime();
  }

  /**
   * Synthesizes a delicate crystalline chime or bell note
   */
  public triggerGenerativeChime(customNote?: string): void {
    if (!this.ctx || !this.isRunning || this.ctx.state !== 'running') return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = this.currentMusicalParams.scaleNotes;

    // Pick note from scale, or apply slight dissonance probability
    let noteToPlay: string;
    if (customNote) {
      noteToPlay = customNote;
    } else if (Math.random() < this.currentMusicalParams.dissonanceRatio) {
      // Occasional intriguing chromatic tension note
      noteToPlay = 'G#4';
    } else {
      const idx = Math.floor(Math.random() * notes.length);
      noteToPlay = notes[idx];
    }

    const freq = this.noteToFrequency(noteToPlay);

    // Chime Oscillator with bell-like exponential decay
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    // Harmonics: blend sine fundamental with subtle high sparkle
    chimeOsc.type = this.currentMusicalParams.majorMinorBalance > 0.5 ? 'sine' : 'triangle';
    chimeOsc.frequency.setValueAtTime(freq, now);

    // Envelope: sharp 8ms attack, long 3.5s to 6s tail
    const velocity = 0.08 + Math.random() * 0.12 * this.currentMusicalParams.leadBrightnessGain;
    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.linearRampToValueAtTime(velocity, now + 0.015);
    chimeGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.2);

    chimeOsc.connect(chimeGain);

    if (this.breathEnvelopeGain && this.convolver && this.delayNode) {
      chimeGain.connect(this.breathEnvelopeGain);
      chimeGain.connect(this.convolver);
      chimeGain.connect(this.delayNode);
    }

    chimeOsc.start(now);
    chimeOsc.stop(now + 4.3);
  }

  /**
   * Applies the mapped musical parameters with smooth audio ramps (interpolated)
   */
  private applyMusicalParameters(m: MusicalParameters): void {
    if (!this.ctx || !this.isRunning) return;

    const now = this.ctx.currentTime;
    const rampTime = 2.5; // smooth 2.5s cross-fade prevents any pops

    // 1. Weather: Filter cutoff & reverb wet
    if (this.droneFilter) {
      this.droneFilter.frequency.setTargetAtTime(m.filterCutoffHz, now, rampTime);
      this.droneFilter.Q.setTargetAtTime(m.filterQ, now, rampTime);
    }
    if (this.reverbWetGain) {
      this.reverbWetGain.gain.setTargetAtTime(m.reverbWet, now, rampTime);
    }
    if (this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(m.atmosphericNoiseGain, now, rampTime);
    }

    // 2. Market: Drone frequencies and tempo
    if (this.subLfo) {
      this.subLfo.frequency.setTargetAtTime(m.seismicRumbleTremoloHz, now, rampTime);
    }

    // 3. Seismic: Sub-bass presence
    if (this.subGain && this.subOsc) {
      this.subGain.gain.setTargetAtTime(m.subBassGain * 0.45, now, rampTime);
      this.subOsc.frequency.setTargetAtTime(m.subBassFrequencyHz, now, rampTime);
    }

    // 4. Terminator: Solar drone pitch & brilliance
    if (this.droneOsc1) {
      this.droneOsc1.frequency.setTargetAtTime(m.solarDroneFreqHz, now, rampTime);
    }
    if (this.droneOsc2) {
      this.droneOsc2.frequency.setTargetAtTime(m.solarDroneFreqHz * 1.5, now, rampTime);
    }
  }

  /**
   * Updates the world parameters smoothly
   */
  public updateParameters(newParams: WorldParameters, smoothSeconds: number = 3.0): void {
    this.targetParams = { ...newParams };
    const stepCount = 30;
    const stepDurationMs = (smoothSeconds * 1000) / stepCount;
    let step = 0;

    const intervalId = window.setInterval(() => {
      step++;
      const factor = step / stepCount;
      this.currentParams = interpolateParameters(this.currentParams, this.targetParams, factor);
      this.currentMusicalParams = mapWorldToMusicalParameters(this.currentParams);
      this.applyMusicalParameters(this.currentMusicalParams);

      if (step >= stepCount) {
        clearInterval(intervalId);
      }
    }, stepDurationMs);
  }

  /**
   * Updates local personal frequency data (weather, time, location)
   */
  public setLocalFrequency(data: LocalFrequencyData | null, enabled: boolean, volume: number = 0.5): void {
    this.currentLocalData = data;
    this.myFreqEnabled = enabled;

    if (!this.ctx || !this.myFreqGain || !this.myFreqFilter || !this.myFreqOsc1 || !this.myFreqOsc2) return;
    const now = this.ctx.currentTime;

    if (!enabled || !data) {
      this.myFreqGain.gain.setTargetAtTime(0.0001, now, 1.5);
      return;
    }

    // Calculate personal frequency notes based on sun elevation & local weather condition
    let baseFreq = 220; // A3
    if (data.condition === 'rain' || data.condition === 'storm') {
      baseFreq = 293.66; // D4
      this.myFreqFilter.type = 'highpass';
      this.myFreqFilter.frequency.setTargetAtTime(450, now, 1.0);
    } else if (data.condition === 'snow' || data.condition === 'mist') {
      baseFreq = 369.99; // F#4 crystalline
      this.myFreqFilter.type = 'bandpass';
      this.myFreqFilter.frequency.setTargetAtTime(1400, now, 1.0);
    } else {
      // Clear/Night: sun elevation shifts frequency
      const sunRatio = (data.sunElevation + 90) / 180; // 0 to 1
      baseFreq = 220 + sunRatio * 220;
      this.myFreqFilter.type = 'lowpass';
      this.myFreqFilter.frequency.setTargetAtTime(1600, now, 1.0);
    }

    this.myFreqOsc1.frequency.setTargetAtTime(baseFreq, now, 2.0);
    this.myFreqOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 2.0);
    this.myFreqGain.gain.setTargetAtTime(volume * 0.28, now, 1.5);
  }

  /**
   * Section 3B: Updates Frequency & Haptic Layer state
   * Crossfades smoothly with 3-5s ramp and activates time-synced haptics
   */
  public setFrequencyLayer(newState: Partial<FrequencyLayerState>): void {
    const prevPreset = this.frequencyLayerState.preset;
    const prevStress = this.frequencyLayerState.stressRegulation;

    this.frequencyLayerState = { ...this.frequencyLayerState, ...newState };
    const current = this.frequencyLayerState;

    if (!this.ctx || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const rampTime = 4.0; // Smooth 3-5s crossfade ramp

    // 1. Stress-Regulation Mode
    if (current.stressRegulation) {
      // Fade out single pure tone
      if (this.pureToneGain) {
        this.pureToneGain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
      // Fade in dual-oscillator bed (hz_396 + hz_528 with 6s breathing LFO)
      if (this.stressGain) {
        const targetVol = Math.max(0, Math.min(0.25, current.gain * 0.18));
        this.stressGain.gain.setTargetAtTime(targetVol, now, rampTime);
      }

      // Synced haptic cycle [600, 200, 600]
      if (current.hapticSync && (!prevStress || !this.stressHapticInterval)) {
        this.startStressHapticLoop();
      }
    } else {
      // Stress mode inactive: ramp down stress gain
      if (this.stressGain) {
        this.stressGain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
      this.stopStressHapticLoop();

      // Check single pure-tone preset
      if (current.preset !== 'none' && current.hz > 0) {
        if (this.pureToneOsc) {
          this.pureToneOsc.frequency.setTargetAtTime(current.hz, now, 1.2);
        }
        if (this.pureToneGain) {
          const targetVol = Math.max(0, Math.min(0.25, current.gain * 0.18));
          this.pureToneGain.gain.setTargetAtTime(targetVol, now, rampTime);
        }

        // Trigger single short haptic pulse [80] on preset engagement
        if (current.hapticSync && prevPreset !== current.preset) {
          this.triggerHaptic('frequency-engaged');
        }
      } else {
        // Off: ramp down pure tone
        if (this.pureToneGain) {
          this.pureToneGain.gain.setTargetAtTime(0.0001, now, rampTime);
        }
      }
    }
  }

  public getFrequencyLayerState(): FrequencyLayerState {
    return { ...this.frequencyLayerState };
  }

  /**
   * Time-synced haptic vibration pattern table (Section 3B)
   */
  public triggerHaptic(trigger: 'frequency-engaged' | 'stress-cycle' | 'moment-saved' | 'room-joined'): void {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    if (!this.frequencyLayerState.hapticSync && trigger !== 'moment-saved' && trigger !== 'room-joined') return;

    try {
      switch (trigger) {
        case 'frequency-engaged':
          // [80] single short pulse on preset selection
          navigator.vibrate([80]);
          break;
        case 'stress-cycle':
          // [600, 200, 600] slow pulse-pause-pulse synced to 6s breath LFO
          navigator.vibrate([600, 200, 600]);
          break;
        case 'moment-saved':
          // [40, 40, 40] triple quick tap on successful save
          navigator.vibrate([40, 40, 40]);
          break;
        case 'room-joined':
          // [200] single medium pulse on joining room
          navigator.vibrate([200]);
          break;
      }
    } catch {
      // Ignore if haptics blocked by environment
    }
  }

  private startStressHapticLoop(): void {
    this.stopStressHapticLoop();
    this.triggerHaptic('stress-cycle');
    this.stressHapticInterval = window.setInterval(() => {
      if (this.frequencyLayerState.stressRegulation && this.frequencyLayerState.hapticSync && this.isRunning) {
        this.triggerHaptic('stress-cycle');
      }
    }, 6000); // exactly 6.0s period matching the 6s breath LFO
  }

  private stopStressHapticLoop(): void {
    if (this.stressHapticInterval) {
      window.clearInterval(this.stressHapticInterval);
      this.stressHapticInterval = null;
    }
  }

  /**
   * Controls breath mode envelope swell
   */
  public setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'pause', progress: number): void {
    if (!this.ctx || !this.breathEnvelopeGain) return;
    const now = this.ctx.currentTime;

    let targetGain = 1.0;
    if (phase === 'inhale') {
      // Inhale expands sound from 0.45 to 1.15
      targetGain = 0.45 + progress * 0.70;
    } else if (phase === 'hold') {
      // Hold maintains buoyant serenity
      targetGain = 1.15;
    } else if (phase === 'exhale') {
      // Exhale settles gracefully from 1.15 down to 0.45
      targetGain = 1.15 - progress * 0.70;
    } else {
      // Pause
      targetGain = 0.45;
    }

    this.breathEnvelopeGain.gain.setTargetAtTime(targetGain, now, 0.2);
  }

  public setBreathMode(active: boolean): void {
    this.breathModeActive = active;
    if (!active && this.breathEnvelopeGain && this.ctx) {
      this.breathEnvelopeGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 1.0);
    }
  }

  /**
   * Master Volume controls
   */
  public setMasterVolume(vol: number): void {
    if (!this.masterGain || !this.ctx) return;
    const v = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : v, this.ctx.currentTime, 0.1);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  public stop(): void {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.stopStressHapticLoop();
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
    this.isRunning = false;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getCurrentParameters(): WorldParameters {
    return { ...this.currentParams };
  }

  public getCurrentMusicalParameters(): MusicalParameters {
    return { ...this.currentMusicalParams };
  }

  // Helper: Note name to frequency in Hz (A4 = 440Hz)
  private noteToFrequency(note: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const regex = /^([A-G]#?)([0-9])$/;
    const match = note.match(regex);
    if (!match) return 440;

    const noteName = match[1];
    const octave = parseInt(match[2], 10);
    const semitone = notes.indexOf(noteName);
    // MIDI number: C0 is 12, A4 is 69
    const midi = (octave + 1) * 12 + semitone;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Generates smooth cosmic impulse response for reverb
  private generateCosmicImpulse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const envelope = Math.exp(-n * decay) * Math.sin(Math.PI * n);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }

  // Generates smooth pink noise buffer
  private generatePinkNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    return buffer;
  }
}

// Global singleton instance
export const globalAudioEngine = new EarthAudioEngine();
