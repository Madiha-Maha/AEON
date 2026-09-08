/**
 * Aeon — The Living Symphony of Earth
 * Initial Seed Data for Moments and Resonance Rooms
 */

import { MomentSnapshot, ResonanceRoom } from '../types';

export const INITIAL_MOMENTS: MomentSnapshot[] = [
  {
    id: 'moment-eclipse-2024',
    title: 'Totality Over Mazatlán',
    description: 'The solar shadow crossed the Pacific coast. Deep lunar twilight enveloped the birdsong, and planetary frequencies settled into solemn awe.',
    createdAt: '2024-04-08T18:07:00.000Z',
    dataSnapshot: {
      timestamp: '2024-04-08T18:07:00.000Z',
      weatherVolatility: 0.18,
      marketVolatility: 0.22,
      newsSentiment: 0.72,
      seismicActivity: 0.14,
      terminatorPhase: 0.50,
    },
    localContext: {
      locationName: 'Mazatlán, Mexico',
      condition: 'totality',
    },
    tags: ['eclipse', 'totality', 'celestial', 'tranquility'],
  },
  {
    id: 'moment-equinox-2025',
    title: 'Equinox Twilight Over Tromsø',
    description: 'Perfect equal day and night. The solar terminator hovered across the Arctic Circle as the first autumn auroras sparked.',
    createdAt: '2025-09-22T18:19:00.000Z',
    dataSnapshot: {
      timestamp: '2025-09-22T18:19:00.000Z',
      weatherVolatility: 0.32,
      marketVolatility: 0.15,
      newsSentiment: 0.45,
      seismicActivity: 0.19,
      terminatorPhase: 0.51,
    },
    localContext: {
      locationName: 'Tromsø, Norway',
      condition: 'aurora-mist',
    },
    tags: ['equinox', 'boreal', 'twilight', 'aurora'],
  },
  {
    id: 'moment-ring-of-fire',
    title: 'Pacific Ring of Fire Tectonic Shift',
    description: 'Subterranean seismic energy pulsed along the Mariana trench, driving deep tectonic sub-bass resonances through the audio sphere.',
    createdAt: '2026-02-14T06:42:00.000Z',
    dataSnapshot: {
      timestamp: '2026-02-14T06:42:00.000Z',
      weatherVolatility: 0.41,
      marketVolatility: 0.39,
      newsSentiment: 0.05,
      seismicActivity: 0.86,
      terminatorPhase: 0.72,
    },
    localContext: {
      locationName: 'Pacific Rim',
      condition: 'tectonic-surge',
    },
    tags: ['seismic', 'sub-bass', 'earth', 'deep'],
  },
  {
    id: 'moment-market-inflection',
    title: 'The Solstice Market Inflection',
    description: 'A global economic shift coincided with the winter solstice, creating high rhythmic tension and dense modal dissonance.',
    createdAt: '2025-12-21T14:30:00.000Z',
    dataSnapshot: {
      timestamp: '2025-12-21T14:30:00.000Z',
      weatherVolatility: 0.54,
      marketVolatility: 0.88,
      newsSentiment: -0.42,
      seismicActivity: 0.32,
      terminatorPhase: 0.28,
    },
    tags: ['volatility', 'markets', 'solstice', 'tempo'],
  },
];

export const INITIAL_ROOMS: ResonanceRoom[] = [
  {
    id: 'room-global-dawn',
    name: 'Sanctuary of the Meridian',
    description: 'A shared contemplative space synchronized along the planet’s morning terminator line.',
    hostId: 'host-1',
    createdAt: '2026-09-08T00:00:00.000Z',
    activeCount: 4,
    roomMood: 'celestial-dawn',
    participants: [
      {
        id: 'p-1',
        name: 'Elena',
        location: 'Reykjavik, Iceland',
        coordinates: [64.14, -21.94],
        localTime: '09:00',
        condition: 'Mist & Cold',
        harmonicNote: 'D4',
        isHost: true,
      },
      {
        id: 'p-2',
        name: 'Kenji',
        location: 'Kyoto, Japan',
        coordinates: [35.01, 135.76],
        localTime: '18:00',
        condition: 'Gentle Rain',
        harmonicNote: 'F#4',
      },
      {
        id: 'p-3',
        name: 'Mateo',
        location: 'Santiago, Chile',
        coordinates: [-33.44, -70.66],
        localTime: '06:00',
        condition: 'Clear Dawn',
        harmonicNote: 'A4',
      },
      {
        id: 'p-4',
        name: 'Amara',
        location: 'Nairobi, Kenya',
        coordinates: [-1.29, 36.82],
        localTime: '12:00',
        condition: 'Solar Warmth',
        harmonicNote: 'B4',
      },
    ],
  },
  {
    id: 'room-boreal-solitude',
    name: 'Boreal Twilight Choir',
    description: 'Cool northerly winds and high-latitude pine silence blended into a soft glass-harmonica drone.',
    hostId: 'host-2',
    createdAt: '2026-09-08T01:15:00.000Z',
    activeCount: 3,
    roomMood: 'deep-trance',
    participants: [
      {
        id: 'p-5',
        name: 'Astrid',
        location: 'Tromsø, Norway',
        coordinates: [69.64, 18.95],
        localTime: '10:15',
        condition: 'Boreal Frost',
        harmonicNote: 'D3',
        isHost: true,
      },
      {
        id: 'p-6',
        name: 'Liam',
        location: 'Vancouver, Canada',
        coordinates: [49.28, -123.12],
        localTime: '01:15',
        condition: 'Overcast Night',
        harmonicNote: 'E4',
      },
      {
        id: 'p-7',
        name: 'Sari',
        location: 'Helsinki, Finland',
        coordinates: [60.16, 24.93],
        localTime: '11:15',
        condition: 'Gentle Cloud',
        harmonicNote: 'A3',
      },
    ],
  },
];
