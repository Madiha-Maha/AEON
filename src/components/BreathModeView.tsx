/**
 * Aeon — The Living Symphony of Earth
 * Breath Mode View
 *
 * Smooths global data swells into slow breathing-pace respiratory arcs,
 * guiding users through grounding sessions aligned with planetary resonance.
 */

import React, { useState, useEffect } from 'react';
import { BreathPattern } from '../types';
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { globalAudioEngine } from '../services/audioEngine';

interface BreathModeViewProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onUpdateBreathState: (phase: 'inhale' | 'hold' | 'exhale' | 'pause', progress: number) => void;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: 'Coherent Resonance',
    description: '5.5s Inhale, 5.5s Exhale — aligns heart-rate variability with natural planetary rhythm.',
    inhale: 5.5,
    hold1: 0,
    exhale: 5.5,
    hold2: 0,
  },
  {
    name: '4-7-8 Deep Calm',
    description: 'Pranayama cycle for nervous system down-regulation and deep serenity.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    name: 'Box Breathing',
    description: '4-4-4-4 equal ratio for grounded focus, autonomic balance, and quiet majesty.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
];

export const BreathModeView: React.FC<BreathModeViewProps> = ({
  isPlaying,
  onTogglePlay,
  onUpdateBreathState,
}) => {
  const [selectedPatternIndex, setSelectedPatternIndex] = useState(0);
  const pattern = BREATH_PATTERNS[selectedPatternIndex];

  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(pattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Synchronize respiratory cycle
  useEffect(() => {
    if (!isPlaying) return;

    globalAudioEngine.setBreathMode(true);

    const stepMs = 100;
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 0.1);

      setTimeLeftInPhase((prev) => {
        const next = Math.max(0, prev - 0.1);

        // Calculate progress within current phase (0 -> 1)
        let totalPhaseDuration = 5.5;
        if (phase === 'inhale') totalPhaseDuration = pattern.inhale;
        else if (phase === 'hold') totalPhaseDuration = pattern.hold1;
        else if (phase === 'exhale') totalPhaseDuration = pattern.exhale;
        else if (phase === 'pause') totalPhaseDuration = pattern.hold2;

        const progress = Math.max(0, Math.min(1, 1 - next / (totalPhaseDuration || 1)));
        onUpdateBreathState(phase, progress);
        globalAudioEngine.setBreathPhase(phase, progress);

        if (next <= 0.05) {
          // Transition to next phase
          if (phase === 'inhale') {
            if (pattern.hold1 > 0) {
              setPhase('hold');
              return pattern.hold1;
            } else {
              setPhase('exhale');
              return pattern.exhale;
            }
          } else if (phase === 'hold') {
            setPhase('exhale');
            return pattern.exhale;
          } else if (phase === 'exhale') {
            if (pattern.hold2 > 0) {
              setPhase('pause');
              return pattern.hold2;
            } else {
              setPhase('inhale');
              setCycleCount((c) => c + 1);
              // Trigger gentle celestial bell on cycle completion
              globalAudioEngine.triggerGenerativeChime('D5');
              return pattern.inhale;
            }
          } else {
            // pause -> inhale
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            globalAudioEngine.triggerGenerativeChime('D5');
            return pattern.inhale;
          }
        }

        return next;
      });
    }, stepMs);

    return () => {
      clearInterval(interval);
      globalAudioEngine.setBreathMode(false);
    };
  }, [isPlaying, phase, pattern, onUpdateBreathState]);

  const resetSession = () => {
    setPhase('inhale');
    setTimeLeftInPhase(pattern.inhale);
    setCycleCount(0);
    setSessionSeconds(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale deeply, expanding with the planetary swell';
      case 'hold':
        return 'Hold gently, basking in stillness';
      case 'exhale':
        return 'Exhale softly, releasing tension to the Earth';
      case 'pause':
        return 'Rest in quiet equilibrium';
    }
  };

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = Math.floor(sessionSeconds % 60);

  return (
    <div id="breath-mode-view" className="relative z-10 w-full min-h-full flex flex-col justify-center items-center p-4 sm:p-8 pt-24 pb-16">
      <div className="max-w-3xl w-full backdrop-blur-xl bg-[#0A0E27]/80 rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#3ADBC4] font-medium mb-1">
          <Wind className="w-3.5 h-3.5" />
          <span>Planetary Resonance Grounding</span>
        </div>
        <h2 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-slate-100 mb-2">
          Breath Mode
        </h2>
        <p className="text-sm text-slate-300 font-light max-w-md mb-8">
          The global audio score gently expands and recedes in sync with your breath.
        </p>

        {/* Central Circular Breath Indicator */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-white/10 flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-black/20">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#3ADBC4] mb-1 font-semibold">
              {phase}
            </span>
            <div className="text-5xl font-light font-serif-cormorant text-slate-100">
              {Math.ceil(timeLeftInPhase)}s
            </div>
            <p className="text-[11px] text-slate-400 mt-2 px-2 leading-relaxed">
              {getPhaseInstruction()}
            </p>
          </div>
        </div>

        {/* Breath Metrics */}
        <div className="flex items-center gap-6 my-6 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#E8C170]" />
            <span>{cycleCount} Cycles</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3ADBC4]" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} Grounded</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md ${
              isPlaying
                ? 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
                : 'bg-[#3ADBC4] text-[#0A0E27] hover:bg-[#5EFCE8]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Breath' : 'Begin Breathwork'}</span>
          </button>

          <button
            onClick={resetSession}
            title="Reset session counter"
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors border border-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Breath Patterns Tabs */}
        <div className="w-full pt-6 border-t border-white/10">
          <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate-400 block mb-3">
            Select Resonant Pattern
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BREATH_PATTERNS.map((p, idx) => {
              const isSelected = selectedPatternIndex === idx;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedPatternIndex(idx);
                    setPhase('inhale');
                    setTimeLeftInPhase(p.inhale);
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-[#3ADBC4]/15 border-[#3ADBC4]/40 shadow-sm shadow-[#3ADBC4]/20'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="text-sm font-medium text-slate-200 mb-1">{p.name}</div>
                  <div className="text-[11px] text-slate-400 font-light leading-relaxed">{p.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
