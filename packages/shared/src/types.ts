export interface WorldParameters {
  timestamp: string;
  weatherVolatility: number;   // 0-1, aggregated global weather system intensity
  marketVolatility: number;    // 0-1, normalized VIX-like index
  newsSentiment: number;       // -1 to 1, aggregated sentiment
  seismicActivity: number;     // 0-1, normalized recent seismic energy
  terminatorPhase: number;     // 0-1, position of day/night line, drives tonal brightness
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
  userId?: string;
  title: string;
  description?: string;
  createdAt: string;
  dataSnapshot: WorldParameters;
  frequencyLayer?: FrequencyLayerState;
  localContext?: {
    locationName: string;
    condition: string;
  };
  tags: string[];
}

export interface ResonanceRoomData {
  id: string;
  name: string;
  description: string;
  hostId: string;
  createdAt: string;
  activeCount: number;
}
