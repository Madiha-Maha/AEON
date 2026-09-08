/**
 * Aeon — The Living Symphony of Earth
 * Planetary Parameter Inspector & Simulator
 *
 * Allows users to inspect and override world parameters or simulate celestial events
 * to audibly hear and visually see the generative engine react in real time.
 */

import React from 'react';
import { WorldParameters } from '../types';
import { X, Sliders, RotateCcw, CloudRain, Activity, HeartHandshake, Disc, SunMedium, Sparkles } from 'lucide-react';

interface PlanetaryTunerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: WorldParameters;
  onUpdateParameters: (params: Partial<WorldParameters>) => void;
  onResetToLive: () => void;
}

interface CelestialPreset {
  name: string;
  description: string;
  params: Partial<WorldParameters>;
}

const PRESETS: CelestialPreset[] = [
  {
    name: 'Equinox Dawn Chorus',
    description: 'Solar terminator at horizon, tranquil markets, celestial Lydian overtones.',
    params: {
      weatherVolatility: 0.28,
      marketVolatility: 0.18,
      newsSentiment: 0.65,
      seismicActivity: 0.15,
      terminatorPhase: 0.50,
    },
  },
  {
    name: 'Atlantic Supercell Storm',
    description: 'High atmospheric volatility, expanded 6kHz filter space and roaring 16s shimmer reverb.',
    params: {
      weatherVolatility: 0.92,
      marketVolatility: 0.45,
      newsSentiment: -0.15,
      seismicActivity: 0.30,
      terminatorPhase: 0.35,
    },
  },
  {
    name: 'Pacific Ring of Fire Tremor',
    description: 'Elevated seismic activity pulsing deep 36Hz subterranean sub-bass pressure.',
    params: {
      weatherVolatility: 0.35,
      marketVolatility: 0.55,
      newsSentiment: 0.05,
      seismicActivity: 0.88,
      terminatorPhase: 0.70,
    },
  },
  {
    name: 'Midnight Volatility Spike',
    description: 'High financial volatility, rapid 84 BPM cadence, nocturnal minor tension.',
    params: {
      weatherVolatility: 0.50,
      marketVolatility: 0.88,
      newsSentiment: -0.65,
      seismicActivity: 0.40,
      terminatorPhase: 0.08,
    },
  },
  {
    name: 'Global Planetary Calm',
    description: 'Gentle solar noon, peaceful sentiment, deep tranquil harmonic resonance.',
    params: {
      weatherVolatility: 0.12,
      marketVolatility: 0.10,
      newsSentiment: 0.82,
      seismicActivity: 0.12,
      terminatorPhase: 0.95,
    },
  },
];

export const PlanetaryTunerModal: React.FC<PlanetaryTunerModalProps> = ({
  isOpen,
  onClose,
  parameters,
  onUpdateParameters,
  onResetToLive,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="planetary-tuner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="max-w-2xl w-full bg-[#0A0E27]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E8C170] font-medium mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Planetary Resonance Simulator</span>
        </div>
        <h3 className="font-serif-cormorant text-3xl font-light text-slate-100 mb-1">
          Earth Pulse Tuner
        </h3>
        <p className="text-xs text-slate-300 font-light mb-6">
          Adjust normalized parameters in real time to hear how the procedural audio graph and aurora visualizer respond.
        </p>

        {/* Sliders Grid */}
        <div className="space-y-4 mb-8">
          {/* Weather */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <CloudRain className="w-4 h-4 text-[#3ADBC4]" />
                Weather Volatility
              </span>
              <span className="font-mono text-[#3ADBC4]">
                {Math.round(parameters.weatherVolatility * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={parameters.weatherVolatility}
              onChange={(e) => onUpdateParameters({ weatherVolatility: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Still / Intimate (280Hz Cutoff)</span>
              <span>Tempest (6kHz Cutoff, 16s Reverb)</span>
            </div>
          </div>

          {/* Market */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Activity className="w-4 h-4 text-[#E8C170]" />
                Market Volatility
              </span>
              <span className="font-mono text-[#E8C170]">
                {Math.round(parameters.marketVolatility * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={parameters.marketVolatility}
              onChange={(e) => onUpdateParameters({ marketVolatility: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#E8C170]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Calm (48 BPM, Spaced Chimes)</span>
              <span>Spike (86 BPM, Rapid Chimes)</span>
            </div>
          </div>

          {/* Sentiment */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Aggregated Sentiment
              </span>
              <span className="font-mono text-emerald-400">
                {parameters.newsSentiment > 0 ? `+${parameters.newsSentiment.toFixed(2)}` : parameters.newsSentiment.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.02"
              value={parameters.newsSentiment}
              onChange={(e) => onUpdateParameters({ newsSentiment: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Deep Nocturnal Dorian (-1.0)</span>
              <span>Radiant Celestial Lydian (+1.0)</span>
            </div>
          </div>

          {/* Seismic */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Disc className="w-4 h-4 text-indigo-400" />
                Seismic Activity
              </span>
              <span className="font-mono text-indigo-400">
                {Math.round(parameters.seismicActivity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={parameters.seismicActivity}
              onChange={(e) => onUpdateParameters({ seismicActivity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Subtle Bedrock Hum</span>
              <span>Deep Tectonic Sub-Bass (36Hz)</span>
            </div>
          </div>

          {/* Terminator Phase */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <SunMedium className="w-4 h-4 text-amber-300" />
                Solar Terminator Phase
              </span>
              <span className="font-mono text-amber-300">
                {Math.round(parameters.terminatorPhase * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={parameters.terminatorPhase}
              onChange={(e) => onUpdateParameters({ terminatorPhase: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-300"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Midnight (0.0)</span>
              <span>Solar Dawn/Dusk (0.5)</span>
              <span>High Zenith (1.0)</span>
            </div>
          </div>
        </div>

        {/* Celestial Presets */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-slate-400 block mb-2">
            Planetary Scenarios & Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => onUpdateParameters(p.params)}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#E8C170]/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 group-hover:text-[#E8C170] transition-colors">
                    {p.name}
                  </span>
                  <Sparkles className="w-3 h-3 text-[#E8C170] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-1">{p.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={onResetToLive}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live Planetary Feed</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
