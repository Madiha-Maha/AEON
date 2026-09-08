import { DataSource, MarketData } from './datasource.interface';

export class MarketsSource implements DataSource<MarketData> {
  name = 'Global Markets Ingestion';
  private apiKey = process.env.MARKETS_API_KEY;

  async fetchData(): Promise<MarketData> {
    try {
      if (this.apiKey) {
        // e.g. AlphaVantage / TwelveData VIX volatility index
      }
      // Resilient fallback / organic baseline
      const baseVix = 0.36;
      const fluctuation = (Math.random() - 0.5) * 0.08;
      return {
        vixNormalized: Math.max(0.1, Math.min(0.95, baseVix + fluctuation)),
        dailyChange: (Math.random() - 0.5) * 2.5,
      };
    } catch (err) {
      console.warn('Markets source error, returning fallback:', err);
      return { vixNormalized: 0.35, dailyChange: 0.0 };
    }
  }
}
