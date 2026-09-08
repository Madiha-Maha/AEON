export interface WorldParameters {
  timestamp: string;
  weatherVolatility: number;   // 0-1, aggregated global weather system intensity
  marketVolatility: number;    // 0-1, normalized VIX-like index
  newsSentiment: number;       // -1 to 1, aggregated sentiment
  seismicActivity: number;     // 0-1, normalized recent seismic energy
  terminatorPhase: number;     // 0-1, position of day/night line, drives tonal brightness
}

export interface MomentSnapshot {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  createdAt: string;
  dataSnapshot: WorldParameters;
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
