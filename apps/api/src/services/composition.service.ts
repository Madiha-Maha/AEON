import { WorldParameters } from '../../../packages/shared/src/types';
import { WeatherSource } from './datasources/weather.source';
import { MarketsSource } from './datasources/markets.source';
import { SentimentSource } from './datasources/sentiment.source';
import { SeismicSource } from './datasources/seismic.source';

export class CompositionService {
  private weatherSource = new WeatherSource();
  private marketsSource = new MarketsSource();
  private sentimentSource = new SentimentSource();
  private seismicSource = new SeismicSource();

  /**
   * Computes diurnal solar terminator phase across the globe
   */
  public computeTerminatorPhase(): number {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    return Number(((utcHours / 24) % 1.0).toFixed(3));
  }

  /**
   * Normalizes all feeds into bounded WorldParameters contract
   */
  public async getNormalizedParameters(): Promise<WorldParameters> {
    const [weather, markets, sentiment, seismic] = await Promise.all([
      this.weatherSource.fetchData(),
      this.marketsSource.fetchData(),
      this.sentimentSource.fetchData(),
      this.seismicSource.fetchData(),
    ]);

    const terminatorPhase = this.computeTerminatorPhase();

    return {
      timestamp: new Date().toISOString(),
      weatherVolatility: Number(weather.globalStormIndex.toFixed(3)),
      marketVolatility: Number(markets.vixNormalized.toFixed(3)),
      newsSentiment: Number(sentiment.globalScore.toFixed(3)),
      seismicActivity: Number(seismic.energyNormalized.toFixed(3)),
      terminatorPhase,
    };
  }
}
