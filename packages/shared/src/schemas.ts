export interface CreateMomentInput {
  title: string;
  description?: string;
  dataSnapshot: {
    timestamp: string;
    weatherVolatility: number;
    marketVolatility: number;
    newsSentiment: number;
    seismicActivity: number;
    terminatorPhase: number;
  };
  tags?: string[];
}

export interface CreateRoomInput {
  name: string;
  description?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
