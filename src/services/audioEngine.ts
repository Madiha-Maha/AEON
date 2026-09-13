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
  private masterVolumeLevel: number = 0.85;
  private isGraphBuilt: boolean = false;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Synthesis nodes
  // 1. Planetary Pad Cluster (Audible warm mid-range harmony)
  private padOsc1: OscillatorNode | null = null; // D3 (146.83 Hz)
  private padOsc2: OscillatorNode | null = null; // A3 (220.0 Hz)
  private padOsc3: OscillatorNode | null = null; // D4 (293.66 Hz)
  private padOsc4: OscillatorNode | null = null; // F#4 / F4 (Modal Color)
  private padOsc5: OscillatorNode | null = null; // A4 (440 Hz)
  private padGain: GainNode | null = null;
  private padFilter: BiquadFilterNode | null = null;

  // 2. Drone Cluster (Deep sub & fundamental grounding)
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneOsc3: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  // 3. Sub-bass seismic rumble
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private subLfo: OscillatorNode | null = null;
  private subLfoGain: GainNode | null = null;

  // 4. Atmospheric wind / pink noise
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 5. Space / Reverb & Delay
  private convolver: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private reverbWetGain: GainNode | null = null;

  // 6. My Frequency (Local texture layer)
  private myFreqGain: GainNode | null = null;
  private myFreqOsc1: OscillatorNode | null = null;
  private myFreqOsc2: OscillatorNode | null = null;
  private myFreqFilter: BiquadFilterNode | null = null;
  private myFreqEnabled: boolean = true;
  private myFreqVolume: number = 0.45;
  private currentLocalData: LocalFrequencyData | null = null;

  // 7. Pure Frequency Bed & Stress Regulation Dual Layer (Section 3B)
  private pureToneOsc: OscillatorNode | null = null;
  private pureToneGain: GainNode | null = null;
  private pureToneHarmonicOsc: OscillatorNode | null = null;
  private pureToneHarmonicGain: GainNode | null = null;
  private pureToneHarmonic2Osc: OscillatorNode | null = null;
  private pureToneHarmonic2Gain: GainNode | null = null;
  private pureToneWobbleLfo: OscillatorNode | null = null;
  private pureToneWobbleGain: GainNode | null = null;

  // 8. Binaural Beats Engine (Stereo Phase Coherence + Brainwave Modulation)
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralLeftPanner: StereoPannerNode | null = null;
  private binauralRightPanner: StereoPannerNode | null = null;
  private binauralGain: GainNode | null = null;
  private binauralTremoloLfo: OscillatorNode | null = null;
  private binauralTremoloGain: GainNode | null = null;

  private stressOsc1: OscillatorNode | null = null; // 396 Hz (tension release)
  private stressOsc2: OscillatorNode | null = null; // 528 Hz (calm/positivity)
  private stressGain: GainNode | null = null;
  private stressLfo: OscillatorNode | null = null; // 0.166 Hz (~6s breathing LFO)
  private stressLfoGain: GainNode | null = null;
  private frequencyLayerState: FrequencyLayerState = {
    preset: 'none',
    hz: 0,
    gain: 0.25,
    hapticSync: true,
    stressRegulation: false,
    soundType: 'singing-bowl',
    soloMode: false,
    binaural: {
      enabled: false,
      mode: 'none',
      beatHz: 7.83,
      carrierHz: 432,
      gain: 0.25,
    },
  };
  private stressHapticInterval: number | null = null;
  private onBowlStrikeCallbacks: ((hz: number, bowlType: string) => void)[] = [];

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

      if (!this.isGraphBuilt) {
        this.buildAudioGraph();
      }

      this.isRunning = true;
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.masterVolumeLevel, now + 0.3);
      }

      this.startChimeGenerator();
      this.applyMusicalParameters(this.currentMusicalParams);
      if (this.currentLocalData) {
        this.setLocalFrequency(this.currentLocalData, this.myFreqEnabled, this.myFreqVolume);
      }

      // Immediate welcoming celestial bell chord so sound is heard immediately upon clicking
      this.triggerGenerativeChime('A4');
      window.setTimeout(() => {
        if (this.isRunning) this.triggerGenerativeChime('D5');
      }, 160);

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
    if (!this.ctx || this.isGraphBuilt) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master Output with Dynamics Compressor for punchy, lush, non-distorted sound
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolumeLevel, now);

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-22, now);
    this.compressor.knee.setValueAtTime(10, now);
    this.compressor.ratio.setValueAtTime(3.5, now);
    this.compressor.attack.setValueAtTime(0.003, now);
    this.compressor.release.setValueAtTime(0.25, now);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.85;

    // Master chain: MasterGain -> Compressor -> Analyser -> Destination
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // Breath Envelope Gain (multiplied into master signal)
    this.breathEnvelopeGain = ctx.createGain();
    this.breathEnvelopeGain.gain.setValueAtTime(1.0, now);
    this.breathEnvelopeGain.connect(this.masterGain);

    // Reverb: Algorithmic Cosmic Shimmer Impulse
    this.convolver = ctx.createConvolver();
    this.convolver.buffer = this.generateCosmicImpulse(ctx, 4.0, 2.5);
    this.reverbWetGain = ctx.createGain();
    this.reverbWetGain.gain.setValueAtTime(0.40, now);

    // Ping-pong style delay for celestial air
    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.45, now);
    this.delayFeedback = ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.32, now);

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Connect Reverb & Delay to Breath Gain
    this.convolver.connect(this.reverbWetGain);
    this.reverbWetGain.connect(this.breathEnvelopeGain);
    this.delayNode.connect(this.breathEnvelopeGain);

    // 1. PLANETARY HARMONIC PAD (Rich mid-range celestial chord cluster)
    // Ensures audio is fully, richly audible across all laptop, phone & desktop speakers
    this.padGain = ctx.createGain();
    this.padGain.gain.setValueAtTime(0.55, now);

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(2400, now);
    this.padFilter.Q.setValueAtTime(1.0, now);

    // Voice 1: D3 (146.83 Hz) warm triangle
    this.padOsc1 = ctx.createOscillator();
    this.padOsc1.type = 'triangle';
    this.padOsc1.frequency.setValueAtTime(146.83, now);

    // Voice 2: A3 (220.0 Hz) warm triangle with chorusing detune
    this.padOsc2 = ctx.createOscillator();
    this.padOsc2.type = 'triangle';
    this.padOsc2.frequency.setValueAtTime(220.0, now);
    this.padOsc2.detune.setValueAtTime(3.8, now);

    // Voice 3: D4 (293.66 Hz) luminous sine
    this.padOsc3 = ctx.createOscillator();
    this.padOsc3.type = 'sine';
    this.padOsc3.frequency.setValueAtTime(293.66, now);
    this.padOsc3.detune.setValueAtTime(-3.5, now);

    // Voice 4: F#4 (369.99 Hz) / F4 (349.23 Hz) - Modal color note
    this.padOsc4 = ctx.createOscillator();
    this.padOsc4.type = 'sine';
    this.padOsc4.frequency.setValueAtTime(369.99, now);

    // Voice 5: A4 (440.0 Hz) high shimmering fifth
    this.padOsc5 = ctx.createOscillator();
    this.padOsc5.type = 'sine';
    this.padOsc5.frequency.setValueAtTime(440.0, now);
    this.padOsc5.detune.setValueAtTime(2.2, now);

    this.padOsc1.connect(this.padFilter);
    this.padOsc2.connect(this.padFilter);
    this.padOsc3.connect(this.padFilter);
    this.padOsc4.connect(this.padFilter);
    this.padOsc5.connect(this.padFilter);
    this.padFilter.connect(this.padGain);

    this.padGain.connect(this.breathEnvelopeGain);
    this.padGain.connect(this.convolver);

    this.padOsc1.start();
    this.padOsc2.start();
    this.padOsc3.start();
    this.padOsc4.start();
    this.padOsc5.start();

    // 2. DRONE CLUSTER (Grounding sub & octave depth)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.40, now);

    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(1200, now);
    this.droneFilter.Q.setValueAtTime(1.2, now);

    // Fundamental D2 (73.42 Hz)
    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(73.42, now);

    // Fifth A2 (110 Hz) with soft detune
    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(110.0, now);
    this.droneOsc2.detune.setValueAtTime(4.2, now);

    // Octave D3 (146.83 Hz)
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

    // 3. SUB-BASS SEISMIC TECTONIC PULSE
    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.45, now);

    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(48.0, now);

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

    // 4. ATMOSPHERIC WIND NOISE (Generated Pink Noise buffer)
    const noiseBuffer = this.generatePinkNoiseBuffer(ctx, 4);
    this.noiseNode = ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(750, now);
    this.noiseFilter.Q.setValueAtTime(1.8, now);

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.04, now);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.breathEnvelopeGain);
    this.noiseGain.connect(this.convolver);

    this.noiseNode.start();

    // 5. MY FREQUENCY PERSONAL LAYER
    this.myFreqGain = ctx.createGain();
    this.myFreqGain.gain.setValueAtTime(0.20, now);

    this.myFreqFilter = ctx.createBiquadFilter();
    this.myFreqFilter.type = 'lowpass';
    this.myFreqFilter.frequency.setValueAtTime(1400, now);

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

    // 6. PURE FREQUENCY OSCILLATOR BED & HARMONICS (Section 3B)
    this.pureToneGain = ctx.createGain();
    this.pureToneGain.gain.setValueAtTime(0.0001, now);

    this.pureToneOsc = ctx.createOscillator();
    this.pureToneOsc.type = 'sine';
    this.pureToneOsc.frequency.setValueAtTime(this.frequencyLayerState.hz || 528, now);

    // Harmonic Overtone 1 (Singing Bowl / Tuning Fork shimmer partial)
    this.pureToneHarmonicGain = ctx.createGain();
    this.pureToneHarmonicGain.gain.setValueAtTime(0.0001, now);
    this.pureToneHarmonicOsc = ctx.createOscillator();
    this.pureToneHarmonicOsc.type = 'sine';
    this.pureToneHarmonicOsc.frequency.setValueAtTime((this.frequencyLayerState.hz || 528) * 2.0, now);

    // Harmonic Overtone 2 (Gongzilla shimmer / high metallic brass overtone)
    this.pureToneHarmonic2Gain = ctx.createGain();
    this.pureToneHarmonic2Gain.gain.setValueAtTime(0.0001, now);
    this.pureToneHarmonic2Osc = ctx.createOscillator();
    this.pureToneHarmonic2Osc.type = 'sine';
    this.pureToneHarmonic2Osc.frequency.setValueAtTime((this.frequencyLayerState.hz || 528) * 3.14, now);

    // Subtle singing bowl acoustic wobble LFO (1.6 Hz)
    this.pureToneWobbleGain = ctx.createGain();
    this.pureToneWobbleGain.gain.setValueAtTime(0.04, now);
    this.pureToneWobbleLfo = ctx.createOscillator();
    this.pureToneWobbleLfo.type = 'sine';
    this.pureToneWobbleLfo.frequency.setValueAtTime(1.6, now);
    this.pureToneWobbleLfo.connect(this.pureToneWobbleGain);
    this.pureToneWobbleGain.connect(this.pureToneGain.gain);

    this.pureToneOsc.connect(this.pureToneGain);
    this.pureToneHarmonicOsc.connect(this.pureToneHarmonicGain);
    this.pureToneHarmonic2Osc.connect(this.pureToneHarmonic2Gain);
    this.pureToneGain.connect(this.masterGain);
    this.pureToneHarmonicGain.connect(this.masterGain);
    this.pureToneHarmonic2Gain.connect(this.masterGain);

    this.pureToneOsc.start();
    this.pureToneHarmonicOsc.start();
    this.pureToneHarmonic2Osc.start();
    this.pureToneWobbleLfo.start();

    // 7. BINAURAL BEATS STEREO ENGINE (Brainwave Entrainment)
    this.binauralGain = ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.0001, now);

    this.binauralLeftOsc = ctx.createOscillator();
    this.binauralRightOsc = ctx.createOscillator();
    this.binauralLeftOsc.type = 'sine';
    this.binauralRightOsc.type = 'sine';

    const defaultCarrier = this.frequencyLayerState.binaural?.carrierHz || 432;
    const defaultBeat = this.frequencyLayerState.binaural?.beatHz || 7.83;
    this.binauralLeftOsc.frequency.setValueAtTime(defaultCarrier, now);
    this.binauralRightOsc.frequency.setValueAtTime(defaultCarrier + defaultBeat, now);

    // Stereo Panning for discrete left/right brain hemisphere stimulus
    if ('createStereoPanner' in ctx) {
      this.binauralLeftPanner = ctx.createStereoPanner();
      this.binauralRightPanner = ctx.createStereoPanner();
      this.binauralLeftPanner.pan.setValueAtTime(-0.95, now);
      this.binauralRightPanner.pan.setValueAtTime(0.95, now);

      this.binauralLeftOsc.connect(this.binauralLeftPanner);
      this.binauralRightOsc.connect(this.binauralRightPanner);
      this.binauralLeftPanner.connect(this.binauralGain);
      this.binauralRightPanner.connect(this.binauralGain);
    } else {
      this.binauralLeftOsc.connect(this.binauralGain);
      this.binauralRightOsc.connect(this.binauralGain);
    }

    // Gentle amplitude modulation (enables brainwave entrainment on speakers too)
    this.binauralTremoloGain = ctx.createGain();
    this.binauralTremoloGain.gain.setValueAtTime(0.05, now);
    this.binauralTremoloLfo = ctx.createOscillator();
    this.binauralTremoloLfo.type = 'sine';
    this.binauralTremoloLfo.frequency.setValueAtTime(defaultBeat, now);
    this.binauralTremoloLfo.connect(this.binauralTremoloGain);
    this.binauralTremoloGain.connect(this.binauralGain.gain);

    this.binauralGain.connect(this.masterGain);

    this.binauralLeftOsc.start();
    this.binauralRightOsc.start();
    this.binauralTremoloLfo.start();

    // 8. STRESS-REGULATION DUAL TONE OSCILLATORS (396Hz + 528Hz with 6s LFO)
    this.stressGain = ctx.createGain();
    this.stressGain.gain.setValueAtTime(0.0001, now);

    this.stressOsc1 = ctx.createOscillator();
    this.stressOsc1.type = 'sine';
    this.stressOsc1.frequency.setValueAtTime(396, now);

    this.stressOsc2 = ctx.createOscillator();
    this.stressOsc2.type = 'sine';
    this.stressOsc2.frequency.setValueAtTime(528, now);

    this.stressLfo = ctx.createOscillator();
    this.stressLfo.type = 'sine';
    this.stressLfo.frequency.setValueAtTime(1 / 6.0, now);

    this.stressLfoGain = ctx.createGain();
    this.stressLfoGain.gain.setValueAtTime(0.05, now);

    this.stressLfo.connect(this.stressLfoGain);
    this.stressLfoGain.connect(this.stressGain.gain);

    this.stressOsc1.connect(this.stressGain);
    this.stressOsc2.connect(this.stressGain);
    this.stressGain.connect(this.masterGain);

    this.stressOsc1.start();
    this.stressOsc2.start();
    this.stressLfo.start();

    // Mark audio graph as successfully initialized
    this.isGraphBuilt = true;

    // Apply any initial frequency layer state
    if (this.frequencyLayerState.preset !== 'none' || this.frequencyLayerState.stressRegulation || this.frequencyLayerState.binaural?.enabled) {
      this.setFrequencyLayer(this.frequencyLayerState);
    }
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
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = this.currentMusicalParams.scaleNotes;

    // Pick note from scale, or apply slight chromatic tension
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

    // Primary bell tone
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = this.currentMusicalParams.majorMinorBalance > 0.5 ? 'sine' : 'triangle';
    chimeOsc.frequency.setValueAtTime(freq, now);

    // Secondary crystalline sparkle (octave overtone)
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(freq * 2, now);

    // Envelope: sharp 10ms attack, resonant 4s tail
    const velocity = 0.28 + Math.random() * 0.14 * this.currentMusicalParams.leadBrightnessGain;
    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.linearRampToValueAtTime(velocity, now + 0.012);
    chimeGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.2);

    sparkleGain.gain.setValueAtTime(0.0001, now);
    sparkleGain.gain.linearRampToValueAtTime(velocity * 0.35, now + 0.010);
    sparkleGain.gain.exponentialRampToValueAtTime(0.00001, now + 2.5);

    chimeOsc.connect(chimeGain);
    sparkleOsc.connect(sparkleGain);

    if (this.breathEnvelopeGain && this.convolver && this.delayNode) {
      chimeGain.connect(this.breathEnvelopeGain);
      chimeGain.connect(this.convolver);
      chimeGain.connect(this.delayNode);

      sparkleGain.connect(this.breathEnvelopeGain);
      sparkleGain.connect(this.convolver);
    }

    chimeOsc.start(now);
    chimeOsc.stop(now + 4.3);
    sparkleOsc.start(now);
    sparkleOsc.stop(now + 2.6);
  }

  /**
   * Applies the mapped musical parameters with smooth audio ramps (interpolated)
   */
  private applyMusicalParameters(m: MusicalParameters): void {
    if (!this.ctx || !this.isRunning) return;

    const now = this.ctx.currentTime;
    const rampTime = 2.5; // smooth 2.5s cross-fade prevents any pops

    // 1. Weather: Filter cutoff & reverb wet
    if (this.padFilter) {
      this.padFilter.frequency.setTargetAtTime(Math.max(1400, m.filterCutoffHz), now, rampTime);
      this.padFilter.Q.setTargetAtTime(m.filterQ, now, rampTime);
    }
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

    // 2. Market: Sub LFO rate
    if (this.subLfo) {
      this.subLfo.frequency.setTargetAtTime(m.seismicRumbleTremoloHz, now, rampTime);
    }

    // 3. Seismic: Sub-bass presence
    if (this.subGain && this.subOsc) {
      this.subGain.gain.setTargetAtTime(m.subBassGain * 0.45, now, rampTime);
      this.subOsc.frequency.setTargetAtTime(m.subBassFrequencyHz, now, rampTime);
    }

    // 4. Terminator & Modal Harmonics: Solar pad pitches & brilliance
    if (this.padOsc1) {
      this.padOsc1.frequency.setTargetAtTime(m.solarDroneFreqHz, now, rampTime);
    }
    if (this.padOsc2) {
      this.padOsc2.frequency.setTargetAtTime(m.solarDroneFreqHz * 1.5, now, rampTime);
    }
    if (this.padOsc3) {
      this.padOsc3.frequency.setTargetAtTime(m.solarDroneFreqHz * 2.0, now, rampTime);
    }
    if (this.padOsc4) {
      const thirdFactor = m.majorMinorBalance > 0.5 ? (369.99 / 146.83) : (349.23 / 146.83);
      this.padOsc4.frequency.setTargetAtTime(m.solarDroneFreqHz * thirdFactor, now, rampTime);
    }
    if (this.droneOsc1) {
      this.droneOsc1.frequency.setTargetAtTime(m.solarDroneFreqHz * 0.5, now, rampTime);
    }
    if (this.droneOsc2) {
      this.droneOsc2.frequency.setTargetAtTime(m.solarDroneFreqHz * 0.75, now, rampTime);
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
    this.myFreqVolume = volume;

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
      this.myFreqFilter.frequency.setTargetAtTime(550, now, 1.0);
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
    this.myFreqGain.gain.setTargetAtTime(volume * 0.40, now, 1.2);
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
    const rampTime = 3.5; // Smooth crossfade ramp

    // 0. Solo Mode: Dim atmospheric pads & drones to highlight healing frequencies
    if (current.soloMode) {
      if (this.padGain) this.padGain.gain.setTargetAtTime(0.08, now, 1.2);
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.06, now, 1.2);
      if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(0.005, now, 1.2);
    } else {
      if (this.padGain) this.padGain.gain.setTargetAtTime(0.55, now, 1.5);
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.40, now, 1.5);
      if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(this.currentMusicalParams.atmosphericNoiseGain, now, 1.5);
    }

    // 1. Stress-Regulation Mode
    if (current.stressRegulation) {
      // Fade out single pure tone
      if (this.pureToneGain) {
        this.pureToneGain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
      if (this.pureToneHarmonicGain) {
        this.pureToneHarmonicGain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
      if (this.pureToneHarmonic2Gain) {
        this.pureToneHarmonic2Gain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
      // Fade in dual-oscillator bed (hz_396 + hz_528 with 6s breathing LFO)
      if (this.stressGain) {
        const targetVol = Math.max(0, Math.min(0.45, current.gain * 0.40));
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
        const hz = current.hz;
        const soundType = current.soundType;

        // Custom timbre profiles for distinct, authentic frequency character
        let waveType: OscillatorType = 'sine';
        let overtone1Mult = 2.0;
        let overtone2Mult = 3.0;
        let harm1Vol = 0.15;
        let harm2Vol = 0.06;
        let lfoSpeed = 1.4;

        if (soundType === 'gongzilla' || current.preset === 'hz_108') {
          // Deep subterranean bronze gong: triangle fundamental, dissonant metallic partials
          waveType = 'triangle';
          overtone1Mult = 1.76;
          overtone2Mult = 3.14;
          harm1Vol = 0.28;
          harm2Vol = 0.16;
          lfoSpeed = 0.7; // Slow oceanic wash
        } else if (soundType === 'tuning-fork') {
          // Ultra-pure steel fork: pure sine with high 3rd harmonic ping
          waveType = 'sine';
          overtone1Mult = 3.0;
          overtone2Mult = 5.0;
          harm1Vol = 0.08;
          harm2Vol = 0.02;
          lfoSpeed = 0.9;
        } else if (soundType === 'harmonics') {
          // Rich choral overtone stack
          waveType = 'sine';
          overtone1Mult = 2.0;
          overtone2Mult = 3.0;
          harm1Vol = 0.24;
          harm2Vol = 0.18;
          lfoSpeed = 1.8;
        } else {
          // Singing bowl: tuned by pitch register for acoustic authenticity
          if (hz < 200) {
            // Sub-bass / Earth frequencies (174Hz, 128Hz, 108Hz, 111Hz, 136.1Hz)
            waveType = 'triangle';
            overtone1Mult = 2.76;
            overtone2Mult = 4.2;
            harm1Vol = 0.22;
            harm2Vol = 0.10;
            lfoSpeed = 1.0;
          } else if (hz < 450) {
            // Mid-low (285Hz, 396Hz, 417Hz, 432Hz)
            waveType = 'sine';
            overtone1Mult = 2.0;
            overtone2Mult = 3.45;
            harm1Vol = 0.18;
            harm2Vol = 0.08;
            lfoSpeed = 1.4;
          } else if (hz < 700) {
            // Mid (528Hz, 639Hz, 512Hz)
            waveType = 'sine';
            overtone1Mult = 2.0;
            overtone2Mult = 2.98;
            harm1Vol = 0.14;
            harm2Vol = 0.05;
            lfoSpeed = 1.8;
          } else {
            // High shimmer (741Hz, 852Hz, 963Hz, 1024Hz)
            waveType = 'sine';
            overtone1Mult = 1.5;
            overtone2Mult = 2.0;
            harm1Vol = 0.10;
            harm2Vol = 0.04;
            lfoSpeed = 2.2;
          }
        }

        if (this.pureToneOsc) {
          this.pureToneOsc.frequency.setTargetAtTime(hz, now, 0.8);
          this.pureToneOsc.type = waveType;
        }

        if (this.pureToneWobbleLfo) {
          this.pureToneWobbleLfo.frequency.setTargetAtTime(lfoSpeed, now, 0.8);
        }

        // Harmonic overtone 1 handling
        if (this.pureToneHarmonicOsc && this.pureToneHarmonicGain) {
          this.pureToneHarmonicOsc.frequency.setTargetAtTime(hz * overtone1Mult, now, 0.8);
          const scaledHarm1 = Math.max(0, Math.min(0.35, current.gain * harm1Vol));
          this.pureToneHarmonicGain.gain.setTargetAtTime(scaledHarm1, now, rampTime);
        }

        // Harmonic overtone 2 handling (extra shimmer & metallic bite)
        if (this.pureToneHarmonic2Osc && this.pureToneHarmonic2Gain) {
          this.pureToneHarmonic2Osc.frequency.setTargetAtTime(hz * overtone2Mult, now, 0.8);
          const scaledHarm2 = Math.max(0, Math.min(0.25, current.gain * harm2Vol));
          this.pureToneHarmonic2Gain.gain.setTargetAtTime(scaledHarm2, now, rampTime);
        }

        if (this.pureToneGain) {
          const targetVol = Math.max(0, Math.min(0.50, current.gain * 0.45));
          this.pureToneGain.gain.setTargetAtTime(targetVol, now, rampTime);
        }

        // Retune ambient drone pads in unison when soloMode is on or preset engaged
        if (current.soloMode) {
          const droneTarget = hz > 200 ? hz / 2 : hz;
          if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(droneTarget, now, 2.5);
          if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(droneTarget * 1.5, now, 2.5);
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
        if (this.pureToneHarmonicGain) {
          this.pureToneHarmonicGain.gain.setTargetAtTime(0.0001, now, rampTime);
        }
        if (this.pureToneHarmonic2Gain) {
          this.pureToneHarmonic2Gain.gain.setTargetAtTime(0.0001, now, rampTime);
        }
      }
    }

    // 2. Binaural Beats Engine
    if (current.binaural?.enabled && current.binaural.mode !== 'none') {
      const carrier = current.binaural.carrierHz || 432;
      const beat = current.binaural.beatHz || 7.83;

      if (this.binauralLeftOsc && this.binauralRightOsc) {
        this.binauralLeftOsc.frequency.setTargetAtTime(carrier, now, 0.8);
        this.binauralRightOsc.frequency.setTargetAtTime(carrier + beat, now, 0.8);
      }
      if (this.binauralTremoloLfo) {
        this.binauralTremoloLfo.frequency.setTargetAtTime(beat, now, 0.8);
      }
      if (this.binauralGain) {
        const binVol = Math.max(0, Math.min(0.40, (current.binaural.gain ?? 0.25) * 0.40));
        this.binauralGain.gain.setTargetAtTime(binVol, now, rampTime);
      }
    } else {
      if (this.binauralGain) {
        this.binauralGain.gain.setTargetAtTime(0.0001, now, rampTime);
      }
    }
  }

  public getFrequencyLayerState(): FrequencyLayerState {
    return { ...this.frequencyLayerState };
  }

  /**
   * Synthesizes an authentic acoustic Tibetan or Quartz crystal singing bowl strike
   * with physical harmonics, slow tremolo wobble, and resonant spatial decay.
   */
  public async strikeSingingBowl(hz: number, bowlType: 'quartz' | 'tibetan' | 'tuning-fork' | 'gongzilla' = 'quartz'): Promise<void> {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.isGraphBuilt) {
      this.buildAudioGraph();
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Determine acoustic profile parameters
    const isGongzilla = bowlType === 'gongzilla' || hz <= 108;
    const isTuningFork = bowlType === 'tuning-fork';
    const isTibetan = bowlType === 'tibetan';

    // 1. Fundamental Strike Oscillator
    const fundOsc = ctx.createOscillator();
    const fundGain = ctx.createGain();
    fundOsc.type = isGongzilla || isTibetan ? 'triangle' : 'sine';
    fundOsc.frequency.setValueAtTime(hz, now);

    // 2. Harmonic Overtone 1
    // Gongzilla has complex inharmonic gong ratios (1.76x); tuning fork has clean 3.0x; Tibetan has 2.76x; quartz has 2.0x
    const overtone1Ratio = isGongzilla ? 1.76 : (isTuningFork ? 3.0 : (isTibetan ? 2.76 : 2.0));
    const harm1Osc = ctx.createOscillator();
    const harm1Gain = ctx.createGain();
    harm1Osc.type = isGongzilla ? 'triangle' : 'sine';
    harm1Osc.frequency.setValueAtTime(hz * overtone1Ratio, now);

    // 3. Harmonic Overtone 2 (Shimmer Ring / Metallic Rim Resonance)
    const overtone2Ratio = isGongzilla ? 3.14 : (isTuningFork ? 5.0 : (isTibetan ? 5.12 : (overtone1Ratio * 1.95)));
    const harm2Osc = ctx.createOscillator();
    const harm2Gain = ctx.createGain();
    harm2Osc.type = 'sine';
    harm2Osc.frequency.setValueAtTime(hz * overtone2Ratio, now);

    // 4. Acoustic Beating Tremolo LFO (Natural air pulsation)
    const wobbleLfo = ctx.createOscillator();
    const wobbleGain = ctx.createGain();
    wobbleLfo.type = 'sine';
    // Gongzilla has slow 0.65Hz oceanic surge; tuning fork 0.8Hz; quartz 1.8Hz; Tibetan 1.5Hz
    const lfoFreq = isGongzilla ? 0.65 : (isTuningFork ? 0.8 : (isTibetan ? 1.5 : 1.8));
    wobbleLfo.frequency.setValueAtTime(lfoFreq, now);
    wobbleGain.gain.setValueAtTime(isGongzilla ? 0.14 : 0.08, now);
    wobbleLfo.connect(wobbleGain);
    wobbleGain.connect(fundGain.gain);

    // Dynamic Strike Envelope
    // Gongzilla resonates for 18 seconds; singing bowl 12s; tuning fork 8s
    const decayTime = isGongzilla ? 18.0 : (isTuningFork ? 8.0 : (isTibetan ? 14.0 : 12.0));
    const baseVel = isGongzilla ? 0.65 : 0.55;

    fundGain.gain.setValueAtTime(0.0001, now);
    fundGain.gain.linearRampToValueAtTime(baseVel, now + (isGongzilla ? 0.040 : 0.015));
    fundGain.gain.exponentialRampToValueAtTime(0.00001, now + decayTime);

    harm1Gain.gain.setValueAtTime(0.0001, now);
    harm1Gain.gain.linearRampToValueAtTime(baseVel * (isGongzilla ? 0.55 : 0.40), now + 0.008);
    harm1Gain.gain.exponentialRampToValueAtTime(0.00001, now + decayTime * 0.75);

    harm2Gain.gain.setValueAtTime(0.0001, now);
    harm2Gain.gain.linearRampToValueAtTime(baseVel * (isGongzilla ? 0.35 : 0.18), now + 0.005);
    harm2Gain.gain.exponentialRampToValueAtTime(0.00001, now + decayTime * 0.55);

    fundOsc.connect(fundGain);
    harm1Osc.connect(harm1Gain);
    harm2Osc.connect(harm2Gain);

    const strikeSum = ctx.createGain();
    strikeSum.gain.setValueAtTime(1.0, now);
    fundGain.connect(strikeSum);
    harm1Gain.connect(strikeSum);
    harm2Gain.connect(strikeSum);

    if (this.masterGain && this.convolver && this.delayNode) {
      strikeSum.connect(this.masterGain);
      strikeSum.connect(this.convolver);
      strikeSum.connect(this.delayNode);
    } else if (this.masterGain) {
      strikeSum.connect(this.masterGain);
    } else {
      strikeSum.connect(ctx.destination);
    }

    fundOsc.start(now);
    harm1Osc.start(now);
    harm2Osc.start(now);
    wobbleLfo.start(now);

    fundOsc.stop(now + decayTime + 0.1);
    harm1Osc.stop(now + decayTime + 0.1);
    harm2Osc.stop(now + decayTime + 0.1);
    wobbleLfo.stop(now + decayTime + 0.1);

    // Notify registered listeners (UI visualizers / ripple cards)
    this.onBowlStrikeCallbacks.forEach((cb) => {
      try {
        cb(hz, bowlType);
      } catch {
        // Safe callback execution
      }
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isGongzilla ? [80, 40, 80] : [45]);
    }
  }

  /**
   * Registers a listener for singing bowl strikes to drive UI animations
   */
  public onBowlStrike(cb: (hz: number, bowlType: string) => void): () => void {
    this.onBowlStrikeCallbacks.push(cb);
    return () => {
      this.onBowlStrikeCallbacks = this.onBowlStrikeCallbacks.filter((c) => c !== cb);
    };
  }

  /**
   * Sound check chime arpeggio (D4 -> A4 -> D5) so user can test and immediately hear output
   */
  public async triggerSoundCheck(): Promise<void> {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.isGraphBuilt) {
      this.buildAudioGraph();
    }
    this.triggerGenerativeChime('D4');
    window.setTimeout(() => this.triggerGenerativeChime('A4'), 180);
    window.setTimeout(() => this.triggerGenerativeChime('D5'), 360);
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
    const v = Math.max(0, Math.min(1, vol));
    this.masterVolumeLevel = v;
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : v, this.ctx.currentTime, 0.08);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolumeLevel, this.ctx.currentTime, 0.08);
    }
    return this.isMuted;
  }

  public stop(): void {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.stopStressHapticLoop();
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    }
    this.isRunning = false;
  }

  public async resume(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public isContextSuspended(): boolean {
    return !!this.ctx && this.ctx.state === 'suspended';
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
