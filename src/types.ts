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

export interface MomentSnapshot {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dataSnapshot: WorldParameters;
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
