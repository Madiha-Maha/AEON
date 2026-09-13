/**
 * Aeon — The Living Symphony of Earth
 * Header & Navigation Chrome
 *
 * Implements the minimal cosmic aesthetic with Cormorant typography
 * and auto-fading controls (~15% opacity on idle, brightens on hover/activity).
 */

import React from 'react';
import { AppMode } from '../types';
import { Volume2, VolumeX, Play, Pause, Radio, Wind, Bookmark, Users, Sparkles, Sliders, Waves, Bell } from 'lucide-react';

interface HeaderNavProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  masterVolume: number;
  onChangeVolume: (vol: number) => void;
  onOpenTuner: () => void;
  onOpenFrequencyModal: () => void;
  isFrequencyActive: boolean;
  frequencyLabel: string;
  isIdle: boolean;
  onTestSound?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onSelectMode,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  masterVolume,
  onChangeVolume,
  onOpenTuner,
  onOpenFrequencyModal,
  isFrequencyActive,
  frequencyLabel,
  isIdle,
  onTestSound,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: 'pulse', label: 'Global Pulse', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'healing', label: 'Healing Sanctuary', icon: <Sparkles className="w-3.5 h-3.5 text-[#3ADBC4]" /> },
    { id: 'my-frequency', label: 'My Frequency', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'moments', label: 'Moments', icon: <Bookmark className="w-3.5 h-3.5" /> },
    { id: 'rooms', label: 'Resonance Rooms', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'breath', label: 'Breath Mode', icon: <Wind className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      id="aeon-header"
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-700 pointer-events-auto ${
        isIdle ? 'opacity-20 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 backdrop-blur-md bg-[#0A0E27]/40 border-b border-white/5">
        {/* Brand Wordmark & Planetary Stream Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif-cormorant text-2xl sm:text-3xl tracking-widest font-light text-slate-100 uppercase">
              Aeon
            </h1>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#3ADBC4] font-medium hidden sm:inline">
              Living Symphony
            </span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-[11px] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ADBC4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ADBC4]"></span>
            </span>
            <span className="tracking-wider uppercase text-[10px] font-mono text-slate-300">
              Earth Pulse · Live
            </span>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full py-1">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                id={`nav-${m.id}`}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3ADBC4]/15 text-[#3ADBC4] border border-[#3ADBC4]/40 shadow-sm shadow-[#3ADBC4]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {m.icon}
                <span className="font-medium tracking-wide">{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Audio Engine Controls & Earth Tuner */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Frequency & Haptic Bed Trigger (Section 3B) */}
          <button
            id="frequency-layer-btn"
            onClick={onOpenFrequencyModal}
            title="Frequency & Haptic Bed (Pure-tone tuning & Stress-Regulation)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all border ${
              isFrequencyActive
                ? 'bg-[#3ADBC4]/15 text-[#3ADBC4] border-[#3ADBC4]/40 shadow-sm shadow-[#3ADBC4]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-white/10'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] hidden sm:inline">
              {frequencyLabel}
            </span>
          </button>

          {/* Planetary Tuner Trigger */}
          <button
            id="tuner-toggle-btn"
            onClick={onOpenTuner}
            title="Planetary Parameter Inspector & Tuner"
            className="p-2 rounded-full text-slate-400 hover:text-[#E8C170] hover:bg-white/5 transition-colors border border-white/10"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Volume Slider & Mute */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <button
              id="mute-toggle-btn"
              onClick={onToggleMute}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : masterVolume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
            />
            {onTestSound && (
              <button
                id="sound-check-btn"
                onClick={onTestSound}
                title="Test Sound: Play Celestial Harmonic Chime"
                className="text-slate-400 hover:text-[#E8C170] transition-colors p-0.5 ml-0.5"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Active Audio Waveform Indicator */}
          {isPlaying && (
            <div className="hidden md:flex items-center gap-0.5 px-1.5 py-1 bg-white/5 rounded-full border border-white/10" title="Living Symphony Synthesizing">
              <span className="w-0.5 h-2.5 bg-[#3ADBC4] rounded-full animate-pulse" />
              <span className="w-0.5 h-4 bg-[#5EFCE8] rounded-full animate-pulse [animation-delay:150ms]" />
              <span className="w-0.5 h-2 bg-[#E8C170] rounded-full animate-pulse [animation-delay:300ms]" />
            </div>
          )}

          {/* Main Play/Tune In Button */}
          <button
            id="main-play-btn"
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all shadow-md ${
              isPlaying
                ? 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
                : 'bg-[#3ADBC4] text-[#0A0E27] hover:bg-[#5EFCE8] font-semibold shadow-[#3ADBC4]/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tune In</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
