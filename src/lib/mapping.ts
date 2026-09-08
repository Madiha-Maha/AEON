/**
 * Aeon — The Living Symphony of Earth
 * Musical Parameter Mapping Engine
 *
 * Implements the mathematical and musical translations from normalized
 * planetary parameters to procedural sound synthesis parameters.
 */

import { WorldParameters } from '../types';

export interface MusicalParameters {
  // Master / Temporal
  tempoBpm: number;                 // 44 to 88 BPM
  rhythmicDensityInterval: number;  // Seconds between melodic chime pulses

  // Filters & Space
  filterCutoffHz: number;          // 250Hz to 6500Hz
  filterQ: number;                 // Resonance factor
  reverbDecaySeconds: number;      // 3.5s to 18.0s
  reverbWet: number;               // 0.35 to 0.85
  atmosphericNoiseGain: number;    // 0.02 to 0.18 (soft atmospheric breath/wind)

  // Harmony & Modality
  rootNote: string;                // e.g. "D", "E", "A"
  baseOctave: number;
  scaleNotes: string[];            // Active chord notes / scale
  dissonanceRatio: number;         // 0 to 1 (probability of non-diatonic tension note)
  majorMinorBalance: number;       // 0 = purely minor/dark, 1 = purely major/celestial

  // Planetary Sub-Bass (Seismic)
  subBassGain: number;             // 0.1 to 0.95
  subBassFrequencyHz: number;      // 32.7Hz (C1) to 55Hz (A1)
  seismicRumbleTremoloHz: number;  // 0.2Hz to 3.5Hz

  // Lead / Timbre (Terminator Phase - Solar Angle)
  leadBrightnessGain: number;      // 0.15 to 0.85
  leadHarmonicOvertoneIndex: number;// Waveform overtone depth
  solarDroneFreqHz: number;        // Primary celestial drone frequency
}

// Modal scales for harmonious planetary sonification
const CELESTIAL_MAJOR_PENTATONIC = ['D3', 'E3', 'F#3', 'A3', 'B3', 'D4', 'E4', 'F#4', 'A4'];
const NOCTURNAL_MINOR_PENTATONIC = ['D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4'];
const LYDIAN_AURA = ['D3', 'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D4', 'E4'];
const DORIAN_DEEP = ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'];

/**
 * Maps raw normalized WorldParameters into precise synthesis parameters.
 */
export function mapWorldToMusicalParameters(params: WorldParameters): MusicalParameters {
  const {
    weatherVolatility,
    marketVolatility,
    newsSentiment,
    seismicActivity,
    terminatorPhase,
  } = params;

  // 1. Weather Volatility: drives filter cutoff, reverb decay, and atmospheric air
  // High weather turbulence expands the acoustic space and opens high-frequency textures
  const filterCutoffHz = 280 + Math.pow(weatherVolatility, 1.3) * 5800; // 280Hz - 6080Hz
  const filterQ = 1.0 + weatherVolatility * 3.5;
  const reverbDecaySeconds = 4.0 + weatherVolatility * 12.0; // 4s to 16s majestic hall
  const reverbWet = 0.35 + weatherVolatility * 0.45; // 0.35 to 0.80
  const atmosphericNoiseGain = 0.02 + weatherVolatility * 0.16;

  // 2. Market Volatility: drives tempo, rhythmic pacing, and harmonic dissonance
  // High market fluctuation quickens the pulse and introduces micro-tension
  const tempoBpm = 48 + marketVolatility * 38; // 48 - 86 BPM (remains contemplative)
  // Rhythmic chime trigger interval (seconds between generative pulses)
  const rhythmicDensityInterval = Math.max(1.5, 7.5 - marketVolatility * 5.0);
  const dissonanceRatio = Math.min(0.35, marketVolatility * 0.35);

  // 3. News Sentiment: drives harmonic mode (major / minor blend)
  // Positive sentiment (+1) favors radiant Lydian/Major, negative (-1) favors deep Dorian/Minor
  const normalizedSentiment = (newsSentiment + 1) / 2; // convert -1..1 to 0..1
  const majorMinorBalance = Math.max(0, Math.min(1, normalizedSentiment));

  let scaleNotes: string[];
  if (majorMinorBalance > 0.65) {
    scaleNotes = CELESTIAL_MAJOR_PENTATONIC;
  } else if (majorMinorBalance < 0.35) {
    scaleNotes = NOCTURNAL_MINOR_PENTATONIC;
  } else {
    // Balanced or transitional twilight
    scaleNotes = terminatorPhase > 0.5 ? LYDIAN_AURA : DORIAN_DEEP;
  }

  // 4. Seismic Activity: drives sub-bass gain, sub-frequency and subterranean pulse
  // Normalized seismic energy activates deep tectonic frequencies
  const subBassGain = 0.15 + Math.pow(seismicActivity, 1.2) * 0.80; // up to 0.95
  const subBassFrequencyHz = 36.7 + (1 - seismicActivity) * 18.0; // 36.7Hz to 54.7Hz
  const seismicRumbleTremoloHz = 0.3 + seismicActivity * 2.5;

  // 5. Terminator Phase: drives celestial solar brightness, lead timbre & overtones
  // 0.0 = Deep Midnight, 0.5 = Golden Dawn / Dusk, 1.0 = Solar Zenith
  const leadBrightnessGain = 0.20 + terminatorPhase * 0.65;
  const leadHarmonicOvertoneIndex = 1.0 + terminatorPhase * 4.0;
  // Fundamental drone frequency (D2 = 73.42Hz, or A1 = 55Hz)
  const solarDroneFreqHz = 73.416 * (1 + (terminatorPhase - 0.5) * 0.04);

  return {
    tempoBpm,
    rhythmicDensityInterval,
    filterCutoffHz,
    filterQ,
    reverbDecaySeconds,
    reverbWet,
    atmosphericNoiseGain,
    rootNote: 'D',
    baseOctave: 3,
    scaleNotes,
    dissonanceRatio,
    majorMinorBalance,
    subBassGain,
    subBassFrequencyHz,
    seismicRumbleTremoloHz,
    leadBrightnessGain,
    leadHarmonicOvertoneIndex,
    solarDroneFreqHz,
  };
}

/**
 * Linearly interpolates between two numbers
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Smoothly interpolates between two WorldParameters sets over time to prevent audio pops
 */
export function interpolateParameters(
  current: WorldParameters,
  target: WorldParameters,
  factor: number
): WorldParameters {
  const f = Math.max(0, Math.min(1, factor));
  return {
    timestamp: target.timestamp,
    weatherVolatility: lerp(current.weatherVolatility, target.weatherVolatility, f),
    marketVolatility: lerp(current.marketVolatility, target.marketVolatility, f),
    newsSentiment: lerp(current.newsSentiment, target.newsSentiment, f),
    seismicActivity: lerp(current.seismicActivity, target.seismicActivity, f),
    terminatorPhase: lerp(current.terminatorPhase, target.terminatorPhase, f),
  };
}
