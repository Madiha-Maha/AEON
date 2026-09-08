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
  | "hz_174"  // often used for a grounding, tension-easing tone
  | "hz_285"  // used for a sense of renewal/restoration
  | "hz_396"  // used for easing tension and worry
  | "hz_417"  // used for a sense of releasing/resetting
  | "hz_528"  // widely used "calm/positivity" tuning
  | "hz_639"  // used for connection-focused sessions
  | "hz_741"  // used for mental clarity/focus
  | "hz_852"  // used for a sense of spaciousness/awareness
  | "hz_963"  // used for deep stillness/meditation
  | "none";

export interface FrequencyLayerState {
  preset: FrequencyPreset;
  hz: number;           // exact frequency value driving the oscillator
  gain: number;          // 0-1, independent of main composition volume
  hapticSync: boolean;
  stressRegulation?: boolean; // layers hz_396 under hz_528 with 6s LFO breathing cycle
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

export type AppMode = 'pulse' | 'my-frequency' | 'moments' | 'rooms' | 'breath';

export interface BreathPattern {
  name: string;
  description: string;
  inhale: number;  // seconds
  hold1: number;
  exhale: number;
  hold2: number;
}
