/**
 * Aeon — The Living Symphony of Earth
 * Core TypeScript definitions and Parameter Contract
 */

export interface WorldParameters {
  timestamp: string;
  weatherVolatility: number;   // 0-1, aggregated global weather system intensity
  marketVolatility: number;    // 0-1, normalized VIX-like index
  newsSentiment: number;       // -1 to 1, aggregated sentiment
  seismicActivity: number;     // 0-1, normalized recent seismic energy
  terminatorPhase: number;     // 0-1, position of day/night line, drives tonal brightness
}

export interface AudioEngineState {
  isPlaying: boolean;
  isMuted: boolean;
  masterVolume: number;        // 0-1
  myFrequencyVolume: number;   // 0-1
  myFrequencyEnabled: boolean;
  currentParameters: WorldParameters;
  targetParameters: WorldParameters;
  isInterpolating: boolean;
  breathModeActive: boolean;
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'pause';
  breathProgress: number;      // 0-1
}

export interface LocalFrequencyData {
  city: string;
  country: string;
  lat: number;
  lng: number;
  localTime: string;
  temperatureC: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'mist' | 'night';
  windKmh: number;
  humidity: number;
  sunElevation: number;        // in degrees (-90 to +90)
  instrumentVoice: 'celesta-drops' | 'twilight-flute' | 'crystalline-pad' | 'nocturnal-glass' | 'solar-strings';
}

export type FrequencyPreset =
  | "hz_7_83"   // 7.83 Hz Schumann Resonance (Earth's electromagnetic heartbeat)
  | "hz_40"     // 40 Hz Gamma Peak Cognition & Clarity
  | "hz_64"     // 64 Hz Sub-Bass Grounding & Root Foundation
  | "hz_108"    // 108 Hz Gongzilla Deep Tantric Symphonic Gong Fundamental
  | "hz_111"    // 111 Hz Ancient Chamber Resonant Tone & Endorphins
  | "hz_128"    // 128 Hz Otto Tuner (Master Nitric Oxide & Bone Harmony)
  | "hz_136_1"  // 136.1 Hz Cosmic OM / Earth Year Resonance
  | "hz_174"    // 174 Hz Grounding & Anesthetic Physical Relief (Solfeggio)
  | "hz_194_18" // 194.18 Hz Earth Day Meridian Grounding (Synodic Day)
  | "hz_210_42" // 210.42 Hz Synodic Moon Flow & Emotional Water Resonance
  | "hz_256"    // 256 Hz Scientific / Pythagorean Sacred C
  | "hz_285"    // 285 Hz Quantum Cellular Renewal & Vitality (Solfeggio)
  | "hz_320"    // 320 Hz Solar Plexus Manifestation & Willpower
  | "hz_396"    // 396 Hz Liberation from Fear & Guilt (Solfeggio Root)
  | "hz_417"    // 417 Hz Undoing Blocks & Facilitating Change (Solfeggio Sacral)
  | "hz_432"    // 432 Hz Verdi Sacred Nature Tone (Fibonacci Golden Ratio)
  | "hz_440"    // 440 Hz Standard Concert Pitch Reference
  | "hz_528"    // 528 Hz Miracle Tone / DNA Repair & Transformation (Solfeggio Heart)
  | "hz_639"    // 639 Hz Harmonious Relationships & Empathy (Solfeggio Heart/Throat)
  | "hz_741"    // 741 Hz Awakening Intuition & Cellular Detox (Solfeggio Throat)
  | "hz_852"    // 852 Hz Spiritual Order & Inner Vision (Solfeggio Third Eye)
  | "hz_963"    // 963 Hz Pure Cosmic Transcendence (Solfeggio Crown)
  | "hz_1074"   // 1074 Hz Transpersonal Higher Chakra Resonance
  | "custom"    // Custom Dialed Frequency (1 - 1200 Hz)
  | "none";

export type BrainwaveMode = 'none' | 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'schumann';

export type HealingSoundType = 'pure-sine' | 'singing-bowl' | 'tuning-fork' | 'harmonics' | 'gongzilla';

export interface BinauralConfig {
  enabled: boolean;
  mode: BrainwaveMode;
  beatHz: number;      // e.g. 7.83, 10, 4.5, 40
  carrierHz: number;   // e.g. 432, 528, 136.1
  gain: number;
}

export interface FrequencyLayerState {
  preset: FrequencyPreset;
  hz: number;           // exact frequency value driving the oscillator
  gain: number;          // 0-1, independent of main composition volume
  hapticSync: boolean;
  stressRegulation?: boolean; // layers hz_396 under hz_528 with 6s LFO breathing cycle
  soundType?: HealingSoundType;
  soloMode?: boolean;    // softens planetary drone to highlight pure healing frequencies
  binaural?: BinauralConfig;
}

export interface MomentSnapshot {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dataSnapshot: WorldParameters;
  frequencyLayer?: FrequencyLayerState;
  localContext?: {
    locationName: string;
    condition: string;
  };
  tags: string[];
}

export interface ResonanceParticipant {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  localTime: string;
  condition: string;
  harmonicNote: string;
  isHost?: boolean;
}

export interface ResonanceRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  createdAt: string;
  activeCount: number;
  participants: ResonanceParticipant[];
  roomMood: 'deep-trance' | 'celestial-dawn' | 'storm-harmony' | 'aurora-zenith';
}

export type AppMode = 'pulse' | 'healing' | 'my-frequency' | 'moments' | 'rooms' | 'breath';

export interface BreathPattern {
  name: string;
  description: string;
  inhale: number;  // seconds
  hold1: number;
  exhale: number;
  hold2: number;
}
