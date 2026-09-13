/**
 * Aeon — The Living Symphony of Earth
 * Frequency & Haptic Layer Modal (Section 3B)
 *
 * Provides pure-tone beds (174 Hz - 963 Hz) and Stress-Regulation dual mode (396Hz + 528Hz)
 * underneath the global composition, time-synced with device haptics.
 */

import React from 'react';
import { FrequencyLayerState, FrequencyPreset } from '../types';
import { FREQUENCY_PRESETS } from '../lib/frequency-presets';
import { globalAudioEngine } from '../services/audioEngine';
import { X, Sparkles, HeartPulse, Smartphone, Volume2, ShieldCheck } from 'lucide-react';

interface FrequencyLayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  frequencyState: FrequencyLayerState;
  onChangeFrequencyState: (newState: Partial<FrequencyLayerState>) => void;
  onTriggerHapticTest: () => void;
}

export const FrequencyLayerModal: React.FC<FrequencyLayerModalProps> = ({
  isOpen,
  onClose,
  frequencyState,
  onChangeFrequencyState,
  onTriggerHapticTest,
}) => {
  if (!isOpen) return null;

  const presets = Object.keys(FREQUENCY_PRESETS) as FrequencyPreset[];
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const handleSelectPreset = (preset: FrequencyPreset) => {
    const info = FREQUENCY_PRESETS[preset];
    onChangeFrequencyState({
      preset,
      hz: info.hz,
      stressRegulation: false,
    });
  };

  const handleToggleStressRegulation = () => {
    const nextStress = !frequencyState.stressRegulation;
    onChangeFrequencyState({
      stressRegulation: nextStress,
      // If activating stress regulation, set preset to none so they don't collide
      preset: nextStress ? 'none' : frequencyState.preset,
      hz: nextStress ? 528 : frequencyState.hz,
    });
  };

  return (
    <div
      id="frequency-layer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative w-full max-w-2xl bg-[#0A0E27]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3ADBC4] font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 3B · Tonal Bed & Somatic Resonance</span>
            </div>
            <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-light text-slate-100">
              Frequency & Haptic Layer
            </h2>
            <p className="text-xs text-slate-400 font-light mt-1 max-w-lg">
              A pure-tone bed generated at exact acoustic frequencies underneath Earth's live symphony. Sits softly in the sub-current for traditional centering and deep focus.
            </p>
          </div>
          <button
            id="close-frequency-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stress-Regulation Mode Hero Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#0A0E27] border border-[#3ADBC4]/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#3ADBC4]/15 text-[#3ADBC4] border border-[#3ADBC4]/30 mt-0.5">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Stress-Regulation Dual Mode
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3ADBC4]/20 text-[#3ADBC4] font-mono tracking-wider uppercase">
                    396 Hz + 528 Hz
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-light mt-1">
                  Layers 396 Hz (tension release) under 528 Hz (calm) modulated by a slow 6-second rhythmic breathing LFO.
                </p>
              </div>
            </div>

            <button
              id="toggle-stress-regulation-btn"
              onClick={handleToggleStressRegulation}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap self-start sm:self-auto ${
                frequencyState.stressRegulation
                  ? 'bg-[#3ADBC4] text-[#0A0E27] shadow-lg shadow-[#3ADBC4]/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/15'
              }`}
            >
              {frequencyState.stressRegulation ? 'Active Breathing Bed' : 'Engage Stress Mode'}
            </button>
          </div>
        </div>

        {/* Individual Frequency Presets Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Pure-Tone Tuning Presets
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeFrequencyState({ soloMode: !frequencyState.soloMode })}
                className={`text-[11px] px-2.5 py-1 rounded-full font-mono transition-colors ${
                  frequencyState.soloMode ? 'bg-[#3ADBC4] text-[#0A0E27] font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {frequencyState.soloMode ? 'Solo Focus Mode (Active)' : 'Enable Solo Mode'}
              </button>
              <span className="text-[11px] text-slate-500 font-mono">
                Dedicated Oscillator · Exact Hz
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {presets.map((key) => {
              const preset = FREQUENCY_PRESETS[key];
              const isSelected = !frequencyState.stressRegulation && frequencyState.preset === key;

              return (
                <div
                  key={key}
                  id={`preset-${key}`}
                  className={`group relative flex flex-col justify-between text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-[#3ADBC4]/15 border-[#3ADBC4] shadow-sm shadow-[#3ADBC4]/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div
                    onClick={() => handleSelectPreset(key)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className={`text-xs font-semibold font-mono ${isSelected ? 'text-[#3ADBC4]' : 'text-slate-200'}`}>
                        {preset.label}
                      </span>
                      {key !== 'none' && key !== 'custom' && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {preset.hz}Hz
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-slate-200 truncate">{preset.name}</div>
                    <span className="text-[10px] text-slate-400 font-light line-clamp-2 leading-snug mt-1">
                      {preset.description}
                    </span>
                  </div>

                  {preset.hz > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        globalAudioEngine.strikeSingingBowl(preset.hz, 'quartz');
                      }}
                      className="mt-2 text-[10px] font-mono py-1 rounded bg-white/5 hover:bg-[#E8C170] hover:text-[#0A0E27] text-slate-400 transition-colors text-center border border-white/5"
                    >
                      Strike Bowl
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: Bed Volume & Haptic Feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-5">
          {/* Bed Volume / Gain */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-[#3ADBC4]" />
                <span>Frequency Bed Gain</span>
              </span>
              <span className="font-mono text-[#3ADBC4]">
                {Math.round(frequencyState.gain * 100)}%
              </span>
            </div>
            <input
              id="frequency-gain-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={frequencyState.gain}
              onChange={(e) => onChangeFrequencyState({ gain: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
            />
            <span className="text-[10px] text-slate-400 font-light block mt-1.5">
              Independent from the main symphony — smooth 3–5s crossfade.
            </span>
          </div>

          {/* Haptic Tactile Sync */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-[#E8C170]" />
                <span>Haptic Somatic Sync</span>
              </span>
              <button
                id="toggle-haptic-sync-btn"
                onClick={() => onChangeFrequencyState({ hapticSync: !frequencyState.hapticSync })}
                className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  frequencyState.hapticSync
                    ? 'bg-[#E8C170] text-[#0A0E27] font-semibold'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {frequencyState.hapticSync ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-light">
              Synchronizes tactile pulses ([80ms] on preset shift, [600ms] breath wave) via the audio clock.
            </p>
            {isVibrationSupported && (
              <button
                onClick={onTriggerHapticTest}
                className="mt-2 text-[10px] font-mono text-[#E8C170] hover:underline"
              >
                Test Haptic Pulse [80ms]
              </button>
            )}
          </div>
        </div>

        {/* Wellness Framing Notice */}
        <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 font-light">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Framed as traditional sound-tuning options for relaxation, meditation, and focus. No medical claims are made or implied.
          </span>
        </div>
      </div>
    </div>
  );
};
