export interface DataSource<T> {
  name: string;
  fetchData(): Promise<T>;
}

export interface WeatherData {
  globalStormIndex: number; // 0-1
  jetStreamVelocity: number;
}

export interface MarketData {
  vixNormalized: number; // 0-1
  dailyChange: number;
}

export interface SentimentData {
  globalScore: number; // -1 to 1
  headlineSample: string;
}

export interface SeismicData {
  latestMagnitude: number;
  energyNormalized: number; // 0-1
  recentEventsCount: number;
}
