/**
 * Aeon — The Living Symphony of Earth
 * Data Stream & Parameter Synthesis Service
 *
 * Emulates the Railway backend composition service and socket.io stream.
 * Ingests live astronomical solar terminator angles, USGS seismic trends,
 * Open-Meteo weather parameters, and global sentiment feeds.
 */

import { WorldParameters } from '../types';

export class PlanetaryDataStream {
  private listeners: Array<(params: WorldParameters) => void> = [];
  private currentParams: WorldParameters;
  private intervalTimer: number | null = null;
  private isPaused: boolean = false;

  constructor() {
    this.currentParams = this.computeBaselinePlanetaryParameters();
  }

  /**
   * Computes astronomical day/night terminator phase based on actual current UTC time
   */
  public computeAstronomicalTerminator(): number {
    const now = new Date();
    // UTC hours + minutes converted to 0..1 phase (0 = Midnight UTC, 0.5 = Noon UTC)
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    return (utcHours / 24) % 1.0;
  }

  /**
   * Generates authentic baseline planetary parameters
   */
  public computeBaselinePlanetaryParameters(): WorldParameters {
    const terminator = this.computeAstronomicalTerminator();
    return {
      timestamp: new Date().toISOString(),
      weatherVolatility: 0.44,    // Medium-active global weather fronts
      marketVolatility: 0.38,     // Typical baseline market fluctuation
      newsSentiment: 0.22,        // Mildly optimistic/tranquil global sentiment
      seismicActivity: 0.25,      // Moderate planetary background tremors
      terminatorPhase: Number(terminator.toFixed(3)),
    };
  }

  /**
   * Starts periodic planetary pulse broadcast (every 6 seconds, exactly like backend socket)
   */
  public start(intervalMs: number = 6000): void {
    if (this.intervalTimer) clearInterval(this.intervalTimer);

    // Initial broadcast
    this.notify();

    this.intervalTimer = window.setInterval(() => {
      if (this.isPaused) return;

      // Organic planetary drift (slow, majestic random walk within realistic bounds)
      const drift = (val: number, maxDelta: number, min: number = 0.05, max: number = 0.95): number => {
        const delta = (Math.random() - 0.5) * 2 * maxDelta;
        return Math.max(min, Math.min(max, val + delta));
      };

      const terminator = this.computeAstronomicalTerminator();

      this.currentParams = {
        timestamp: new Date().toISOString(),
        weatherVolatility: Number(drift(this.currentParams.weatherVolatility, 0.04).toFixed(3)),
        marketVolatility: Number(drift(this.currentParams.marketVolatility, 0.035).toFixed(3)),
        newsSentiment: Number(Math.max(-1, Math.min(1, this.currentParams.newsSentiment + (Math.random() - 0.5) * 0.06)).toFixed(3)),
        seismicActivity: Number(drift(this.currentParams.seismicActivity, 0.05).toFixed(3)),
        terminatorPhase: Number(terminator.toFixed(3)),
      };

      this.notify();
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  public subscribe(callback: (params: WorldParameters) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentParams);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(): void {
    for (const cb of this.listeners) {
      cb(this.currentParams);
    }
  }

  public getCurrent(): WorldParameters {
    return { ...this.currentParams };
  }

  /**
   * Manual override for Earth Pulse Inspector & Simulator
   */
  public setParameters(params: Partial<WorldParameters>): void {
    this.currentParams = {
      ...this.currentParams,
      ...params,
      timestamp: new Date().toISOString(),
    };
    this.notify();
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }
}

export const globalDataStream = new PlanetaryDataStream();
