/**
 * Aeon — The Living Symphony of Earth
 * Global Pulse View (Main Experience)
 *
 * Implements the continuous living stream mapped from live world data parameters.
 */

import React, { useState } from 'react';
import { WorldParameters } from '../types';
import { CloudRain, Activity, HeartHandshake, Disc, SunMedium, Play, BookmarkPlus, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface GlobalPulseViewProps {
  parameters: WorldParameters;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onCaptureMoment: () => void;
  onOpenTuner: () => void;
}

export const GlobalPulseView: React.FC<GlobalPulseViewProps> = ({
  parameters,
  isPlaying,
  onTogglePlay,
  onCaptureMoment,
  onOpenTuner,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Compute percentage strings
  const weatherPct = Math.round(parameters.weatherVolatility * 100);
  const marketPct = Math.round(parameters.marketVolatility * 100);
  const seismicPct = Math.round(parameters.seismicActivity * 100);
  const terminatorPct = Math.round(parameters.terminatorPhase * 100);
  const sentimentVal = parameters.newsSentiment;
  const sentimentLabel = sentimentVal > 0.3 ? 'Tranquil' : sentimentVal < -0.3 ? 'Tense' : 'Equilibrium';

  return (
    <div id="global-pulse-view" className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-8 pointer-events-none">
      {/* Top spacer */}
      <div className="h-16"></div>

      {/* Center Cosmic Welcome / Status when not playing */}
      {!isPlaying && (
        <div className="self-center text-center max-w-lg my-auto pointer-events-auto backdrop-blur-xl bg-[#0A0E27]/70 p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/80">
          <span className="text-xs uppercase tracking-[0.25em] text-[#3ADBC4] font-medium block mb-2">
            The Living Symphony of Earth
          </span>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-light text-slate-100 mb-4 tracking-wide leading-tight">
            Earth never stops playing.
          </h2>
          <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
            You don’t press play on a track. You tune into the living, real-time emotional
            pulse of our planet — weather systems, seismic tremors, market volatility,
            and the day/night solar boundary synthesized into an eternal ambient score.
          </p>
          <button
            id="center-tune-in-btn"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#3ADBC4] text-[#0A0E27] font-semibold text-sm tracking-wider uppercase hover:bg-[#5EFCE8] transition-all shadow-lg shadow-[#3ADBC4]/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            Tune Into Earth
          </button>
        </div>
      )}

      {/* Bottom Floating Telemetry & Parameter Readout */}
      <div className="w-full max-w-5xl mx-auto pointer-events-auto">
        <div className="backdrop-blur-md bg-[#0A0E27]/60 rounded-2xl border border-white/10 p-4 sm:p-5 shadow-2xl transition-all">
          {/* Top Bar of Telemetry: Quick Summary + Toggle Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                Planetary Feed · {new Date(parameters.timestamp).toLocaleTimeString()} UTC
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8C170]/15 text-[#E8C170] border border-[#E8C170]/30 font-mono">
                Dorian / Celestial D
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onCaptureMoment}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Save current living state as a Moment"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#E8C170]" />
                <span>Capture Moment</span>
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showDetails ? 'Hide Mapping' : 'Sonic Mapping'}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* 5 Planetary Parameter Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-3">
            {/* Weather */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#3ADBC4]/30 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-mono">Weather</span>
                <CloudRain className="w-3.5 h-3.5 text-[#3ADBC4]" />
              </div>
              <div className="text-xl font-light text-slate-100 font-serif-cormorant">{weatherPct}%</div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="bg-[#3ADBC4] h-full rounded-full transition-all duration-1000" style={{ width: `${weatherPct}%` }}></div>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Filters & Reverb Space</span>
            </div>

            {/* Markets */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E8C170]/30 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-mono">Markets</span>
                <Activity className="w-3.5 h-3.5 text-[#E8C170]" />
              </div>
              <div className="text-xl font-light text-slate-100 font-serif-cormorant">{marketPct}%</div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="bg-[#E8C170] h-full rounded-full transition-all duration-1000" style={{ width: `${marketPct}%` }}></div>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Tempo & Rhythmic Chimes</span>
            </div>

            {/* News Sentiment */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-400/30 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-mono">Sentiment</span>
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-light text-slate-100 font-serif-cormorant">
                {sentimentVal > 0 ? `+${sentimentVal.toFixed(2)}` : sentimentVal.toFixed(2)}
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((sentimentVal + 1) / 2) * 100}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">{sentimentLabel} Harmony</span>
            </div>

            {/* Seismic Activity */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-400/30 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-mono">Seismic</span>
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-light text-slate-100 font-serif-cormorant">{seismicPct}%</div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${seismicPct}%` }}></div>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Sub-Bass Tectonic Rumble</span>
            </div>

            {/* Solar Terminator */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-300/30 transition-colors col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-mono">Terminator</span>
                <SunMedium className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="text-xl font-light text-slate-100 font-serif-cormorant">{terminatorPct}%</div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="bg-amber-300 h-full rounded-full transition-all duration-1000" style={{ width: `${terminatorPct}%` }}></div>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Solar Overtone Brightness</span>
            </div>
          </div>

          {/* Collapsible Mapping Table / Explainer */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-black/20 p-3 rounded-xl">
              <div>
                <strong className="text-[#3ADBC4] font-medium block mb-0.5">Atmosphere & Weather</strong>
                Aggregated storm volatility opens the 280Hz–6kHz lowpass filters and extends algorithmic reverb decay up to 16 seconds.
              </div>
              <div>
                <strong className="text-[#E8C170] font-medium block mb-0.5">Markets & Cadence</strong>
                Normalized global volatility controls the 48–86 BPM pulse and sets the generative chime density interval.
              </div>
              <div>
                <strong className="text-emerald-400 font-medium block mb-0.5">Planetary Mantle & Sun</strong>
                Seismic energy drives deep 36Hz–54Hz sub-bass pressure, while diurnal terminator phase shifts the lead overtone timbre.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
