/**
 * Aeon — The Living Symphony of Earth
 * Healing Sanctuary & Frequency Laboratory View
 *
 * Dedicated acoustic sound healing, Solfeggio & Sacred Earth matrix,
 * interactive Tibetan/Quartz singing bowls, Brainwave binaural beats,
 * and live mathematical Cymatics sacred geometry visualization.
 */

import React, { useState, useEffect, useRef } from 'react';
import { FrequencyLayerState, FrequencyPreset, BrainwaveMode, HealingSoundType } from '../types';
import { FREQUENCY_PRESETS, BRAINWAVE_PRESETS } from '../lib/frequency-presets';
import { globalAudioEngine } from '../services/audioEngine';
import {
  Sparkles,
  HeartPulse,
  Volume2,
  Headphones,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Globe,
  Radio,
  Eye,
  Activity,
  Layers,
  Flame,
  Music,
  CheckCircle2,
} from 'lucide-react';

interface HealingSanctuaryViewProps {
  frequencyState: FrequencyLayerState;
  onChangeFrequencyState: (newState: Partial<FrequencyLayerState>) => void;
  isPlaying: boolean;
  onEnsurePlaying: () => void;
}

export const HealingSanctuaryView: React.FC<HealingSanctuaryViewProps> = ({
  frequencyState,
  onChangeFrequencyState,
  isPlaying,
  onEnsurePlaying,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'bowls' | 'brainwaves' | 'wand'>('matrix');
  const [selectedBowlType, setSelectedBowlType] = useState<'quartz' | 'tibetan' | 'tuning-fork' | 'gongzilla'>('quartz');
  const [recentStruckHz, setRecentStruckHz] = useState<number | null>(null);
  const [strikeRipples, setStrikeRipples] = useState<{ id: number; hz: number; timestamp: number }[]>([]);
  const [customDialHz, setCustomDialHz] = useState<number>(frequencyState.hz || 528);
  const [filterCategory, setFilterCategory] = useState<'all' | 'solfeggio' | 'earth' | 'sacred' | 'brainwave'>('all');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Register singing bowl strike listener for visual ripples
  useEffect(() => {
    const unsubscribe = globalAudioEngine.onBowlStrike((hz) => {
      setRecentStruckHz(hz);
      setStrikeRipples((prev) => [
        ...prev.slice(-8),
        { id: Date.now() + Math.random(), hz, timestamp: Date.now() },
      ]);
    });
    return () => unsubscribe();
  }, []);

  // Cymatics Sacred Geometry Visualizer Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.02;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const height = (canvas.height = 320);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Determine frequency parameter for geometry
      const hz = frequencyState.hz > 0 ? frequencyState.hz : (recentStruckHz || 528);
      const activeInfo = Object.values(FREQUENCY_PRESETS).find((p) => Math.abs(p.hz - hz) < 1) || FREQUENCY_PRESETS.hz_528;
      const baseColor = activeInfo.color || '#3ADBC4';

      // Background subtle circular aura
      const radialGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.min(centerX, centerY) * 0.95);
      radialGrad.addColorStop(0, `${baseColor}22`);
      radialGrad.addColorStop(0.6, `${baseColor}08`);
      radialGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(centerX, centerY) * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Audio Engine Analyser data
      const analyser = globalAudioEngine.getAnalyser();
      let energy = 0.15;
      if (analyser) {
        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArr);
        const sum = dataArr.slice(0, 32).reduce((a, b) => a + b, 0);
        energy = 0.15 + (sum / (32 * 255)) * 0.85;
      }

      // Mathematical Cymatics Nodal Petals & Chladni Rings
      const petals = Math.max(3, Math.min(18, Math.round((hz % 12) + 4)));
      const baseRadius = Math.min(width, height) * 0.35;

      // Draw outer harmonic mandala rings
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = (baseRadius / 4) * ring * (1 + Math.sin(time * 0.8 + ring) * 0.05);
        ctx.beginPath();
        ctx.lineWidth = ring === 4 ? 1.5 : 0.75;
        ctx.strokeStyle = ring === 4 ? `${baseColor}88` : `${baseColor}33`;

        for (let a = 0; a <= Math.PI * 2; a += 0.02) {
          // Rosette wave equation
          const r = ringRadius * (1 + (0.12 * Math.sin(petals * a + time * 0.5 * ring)) * energy);
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw crystalline interference nodal star
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = baseColor;
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.03) {
        const modulation = Math.sin(petals * a - time) * Math.cos(petals * 0.5 * a + time * 0.3);
        const r = baseRadius * 0.75 * (0.85 + 0.25 * modulation * (1 + energy * 0.6));
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Center sacred core pulse
      const coreR = Math.max(4, 14 * energy * (1 + Math.sin(time * 2.5) * 0.2));
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Expanding Strike Ripple Rings
      strikeRipples.forEach((ripple) => {
        const elapsed = (Date.now() - ripple.timestamp) / 1000;
        if (elapsed < 3.5) {
          const ripR = (elapsed / 3.5) * (width * 0.55);
          const alpha = (1 - elapsed / 3.5) * 0.7;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ripR, 0, Math.PI * 2);
          ctx.strokeStyle = `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [frequencyState.hz, recentStruckHz, strikeRipples]);

  // Handler to strike singing bowl
  const handleStrikeBowl = async (hz: number) => {
    onEnsurePlaying();
    await globalAudioEngine.strikeSingingBowl(hz, selectedBowlType);
  };

  // Handler to engage continuous pure tone
  const handleSelectPreset = (key: FrequencyPreset) => {
    onEnsurePlaying();
    const info = FREQUENCY_PRESETS[key];
    onChangeFrequencyState({
      preset: key,
      hz: info.hz,
      stressRegulation: false,
    });
  };

  // Handler for custom frequency dial
  const handleApplyCustomHz = (newHz: number) => {
    setCustomDialHz(newHz);
    onEnsurePlaying();
    onChangeFrequencyState({
      preset: 'custom',
      hz: newHz,
      stressRegulation: false,
    });
  };

  // Handler for brainwave binaural activation
  const handleToggleBinaural = (mode: BrainwaveMode, beatHz: number) => {
    onEnsurePlaying();
    const currentBin = frequencyState.binaural;
    const isCurrentlyActive = currentBin?.enabled && currentBin.mode === mode;

    onChangeFrequencyState({
      binaural: {
        enabled: !isCurrentlyActive,
        mode: isCurrentlyActive ? 'none' : mode,
        beatHz,
        carrierHz: currentBin?.carrierHz || 432,
        gain: currentBin?.gain || 0.25,
      },
    });
  };

  // Filter presets
  const presetsList = Object.entries(FREQUENCY_PRESETS).filter(([key, info]) => {
    if (key === 'none' || key === 'custom') return false;
    if (filterCategory === 'all') return true;
    return info.category === filterCategory;
  });

  const activePresetKey = frequencyState.preset;
  const activeInfo = FREQUENCY_PRESETS[activePresetKey] || FREQUENCY_PRESETS.hz_528;

  return (
    <div id="healing-sanctuary-view" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in pb-28">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1635]/90 to-[#070b1f]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3ADBC4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E056FD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ADBC4]/15 border border-[#3ADBC4]/30 text-[#3ADBC4] text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Sound Laboratory · Pure Frequencies</span>
            </div>
            <h1 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-slate-100 tracking-wide">
              Healing Sanctuary & Resonances
            </h1>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Crystal-clear acoustic solfeggio tones, physical singing bowls, sacred Earth frequencies, and dual-hemisphere brainwave entrainment synthesized procedural-live with pristine Web Audio clarity.
            </p>
          </div>

          {/* Quick Audio Character Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
            {/* Solo Mode Switch */}
            <button
              id="solo-healing-mode-btn"
              onClick={() => onChangeFrequencyState({ soloMode: !frequencyState.soloMode })}
              title="Isolates healing frequencies by softening atmospheric noise and background drones"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                frequencyState.soloMode
                  ? 'bg-[#3ADBC4] text-[#0A0E27] font-semibold shadow-lg shadow-[#3ADBC4]/25'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{frequencyState.soloMode ? 'Solo Focus Mode' : 'Symphonic Blend'}</span>
            </button>

            {/* Sound Character Selector */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {(['singing-bowl', 'pure-sine', 'tuning-fork', 'harmonics'] as HealingSoundType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onChangeFrequencyState({ soundType: type })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                    (frequencyState.soundType || 'singing-bowl') === type
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'singing-bowl' ? 'Crystal Bowl' : type === 'tuning-fork' ? 'Tuning Fork' : type === 'pure-sine' ? 'Pure Sine' : 'Harmonics'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Live Cymatics Visualizer & Active Frequency Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cymatics Sacred Geometry Visualizer */}
        <div className="lg:col-span-7 bg-[#0b102b]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300">
              <Activity className="w-3.5 h-3.5 text-[#3ADBC4]" />
              <span>Dynamic Cymatics Geometry</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              {frequencyState.hz > 0 ? `${frequencyState.hz.toFixed(1)} Hz Nodal Resonator` : 'Cosmic Harmonic Field'}
            </span>
          </div>

          <div className="relative w-full flex items-center justify-center my-2">
            <canvas ref={canvasRef} className="w-full h-72 rounded-2xl" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
              {activeInfo.cymaticsGeometry}
            </div>
          </div>

          {/* Quick Strike Singing Bowl Action on Canvas */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <span>Tap any frequency below or strike singing bowls to observe nodal interference geometry.</span>
            <button
              onClick={() => handleStrikeBowl(frequencyState.hz || 528)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8C170]/20 text-[#E8C170] hover:bg-[#E8C170]/30 transition-colors border border-[#E8C170]/40 font-mono text-[11px]"
            >
              <Music className="w-3 h-3" />
              <span>Strike Active Bowl ({frequencyState.hz || 528} Hz)</span>
            </button>
          </div>
        </div>

        {/* Right: Active Resonator Card & Acoustic Slider */}
        <div className="lg:col-span-5 bg-[#0b102b]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span>Active Resonance Layer</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Oscillator Online</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-serif-cormorant font-light text-slate-100">
                    {frequencyState.stressRegulation ? 'Stress-Regulation Bed' : activeInfo.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold"
                      style={{
                        backgroundColor: `${activeInfo.color}25`,
                        color: activeInfo.color,
                        borderColor: `${activeInfo.color}60`,
                        borderWidth: 1,
                      }}
                    >
                      {frequencyState.stressRegulation ? '396 Hz + 528 Hz' : `${activeInfo.hz} Hz`}
                    </span>
                    {activeInfo.chakra && (
                      <span className="text-[11px] text-slate-300 font-mono">
                        {activeInfo.chakra}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  id="toggle-active-preset-btn"
                  onClick={() => {
                    if (frequencyState.preset !== 'none' || frequencyState.stressRegulation) {
                      onChangeFrequencyState({ preset: 'none', stressRegulation: false });
                    } else {
                      handleSelectPreset('hz_528');
                    }
                  }}
                  className={`p-3 rounded-full transition-all ${
                    frequencyState.preset !== 'none' || frequencyState.stressRegulation
                      ? 'bg-[#3ADBC4] text-[#0A0E27]'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  title={frequencyState.preset !== 'none' ? 'Mute Pure Frequency Bed' : 'Engage 528 Hz'}
                >
                  <Play className={`w-4 h-4 ${frequencyState.preset !== 'none' ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {frequencyState.stressRegulation
                  ? 'Dual-tone 396 Hz (tension release) under 528 Hz (calm) modulated by an organic 6-second respiratory cycle.'
                  : activeInfo.description}
              </p>

              {activeInfo.benefits && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeInfo.benefits.map((b, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Volume and Intensity Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#3ADBC4]" />
                <span>Healing Bed Intensity</span>
              </span>
              <span className="font-mono text-slate-200">
                {Math.round((frequencyState.gain || 0.25) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={frequencyState.gain ?? 0.25}
              onChange={(e) => onChangeFrequencyState({ gain: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
            />

            {/* Timbre & Acoustic Voice Profile */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Timbre Profile</span>
                <span className="capitalize text-[#3ADBC4] font-semibold">{frequencyState.soundType || 'singing-bowl'}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['singing-bowl', 'gongzilla', 'tuning-fork', 'harmonics', 'pure-sine'] as const).map((sType) => (
                  <button
                    key={sType}
                    onClick={() => {
                      onEnsurePlaying();
                      onChangeFrequencyState({ soundType: sType });
                    }}
                    className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-mono capitalize transition-all ${
                      (frequencyState.soundType || 'singing-bowl') === sType
                        ? 'bg-[#3ADBC4] text-[#0A0E27] font-bold shadow-md shadow-[#3ADBC4]/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {sType === 'singing-bowl' ? 'Bowl' : sType === 'gongzilla' ? 'Gong' : sType === 'tuning-fork' ? 'Fork' : sType === 'harmonics' ? 'Choral' : 'Sine'}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Mode Shortcut */}
            <button
              onClick={() => {
                onEnsurePlaying();
                const next = !frequencyState.stressRegulation;
                onChangeFrequencyState({
                  stressRegulation: next,
                  preset: next ? 'none' : 'hz_528',
                  hz: next ? 528 : 528,
                });
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                frequencyState.stressRegulation
                  ? 'bg-gradient-to-r from-[#3ADBC4] to-[#2ECC71] text-[#0A0E27] shadow-lg shadow-[#3ADBC4]/25'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{frequencyState.stressRegulation ? 'Active Stress-Regulation (396 + 528 Hz)' : 'Engage 396 + 528 Hz Stress Bed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Features */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            id="tab-matrix-btn"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-[#3ADBC4] text-[#0A0E27] font-semibold shadow-md shadow-[#3ADBC4]/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Solfeggio & Sacred Matrix</span>
          </button>

          <button
            id="tab-bowls-btn"
            onClick={() => setActiveTab('bowls')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'bowls'
                ? 'bg-[#3ADBC4] text-[#0A0E27] font-semibold shadow-md shadow-[#3ADBC4]/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Singing Bowls & Tuning Forks</span>
          </button>

          <button
            id="tab-brainwaves-btn"
            onClick={() => setActiveTab('brainwaves')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'brainwaves'
                ? 'bg-[#3ADBC4] text-[#0A0E27] font-semibold shadow-md shadow-[#3ADBC4]/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Brainwave Entrainment</span>
          </button>

          <button
            id="tab-wand-btn"
            onClick={() => setActiveTab('wand')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'wand'
                ? 'bg-[#3ADBC4] text-[#0A0E27] font-semibold shadow-md shadow-[#3ADBC4]/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Precision Frequency Wand</span>
          </button>
        </div>

        {activeTab === 'matrix' && (
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-500 mr-2">Filter:</span>
            {(['all', 'solfeggio', 'earth', 'sacred', 'brainwave'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: SOLFEGGIO & SACRED MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presetsList.map(([key, info]) => {
              const isSelected = !frequencyState.stressRegulation && frequencyState.preset === key;

              return (
                <div
                  key={key}
                  id={`card-${key}`}
                  className={`group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white/10 border-[#3ADBC4] shadow-xl shadow-[#3ADBC4]/10'
                      : 'bg-[#0A0E27]/80 hover:bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${info.color}20`,
                          color: info.color,
                          border: `1px solid ${info.color}50`,
                        }}
                      >
                        {info.label}
                      </span>

                      {info.chakra && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                          {info.chakra}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-slate-100 group-hover:text-white">
                        {info.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-light mt-1 line-clamp-2">
                        {info.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {info.benefits.slice(0, 2).map((b, idx) => (
                        <span key={idx} className="text-[10px] text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-white/5">
                    <button
                      id={`strike-${key}`}
                      onClick={() => handleStrikeBowl(info.hz)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center justify-center gap-1.5 border border-white/5"
                    >
                      <Music className="w-3 h-3 text-[#E8C170]" />
                      <span>{selectedBowlType === 'gongzilla' || info.hz <= 108 ? 'Strike Gong' : selectedBowlType === 'tuning-fork' ? 'Strike Fork' : 'Strike Bowl'}</span>
                    </button>

                    <button
                      id={`engage-${key}`}
                      onClick={() => handleSelectPreset(key as FrequencyPreset)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-mono font-medium transition-all ${
                        isSelected
                          ? 'bg-[#3ADBC4] text-[#0A0E27]'
                          : 'bg-[#3ADBC4]/15 text-[#3ADBC4] hover:bg-[#3ADBC4]/25 border border-[#3ADBC4]/30'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Tone Bed'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SINGING BOWLS & TUNING FORKS */}
      {activeTab === 'bowls' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/10 gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Acoustic Resonator Type</h3>
              <p className="text-xs text-slate-400">Choose between Quartz Crystal, Ancient Tibetan Metal, Precision Tuning Fork, or Deep Gongzilla Bronze.</p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {(['quartz', 'tibetan', 'tuning-fork', 'gongzilla'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBowlType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all ${
                    selectedBowlType === type
                      ? 'bg-[#E8C170] text-[#0A0E27] font-semibold shadow-md shadow-[#E8C170]/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {type === 'quartz' ? 'Quartz Crystal' : type === 'tibetan' ? 'Tibetan Metal' : type === 'tuning-fork' ? 'Precision Fork' : 'Gongzilla Bronze'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { hz: 108, name: 'Gongzilla Prime', note: 'A2', color: '#D4AF37' },
              { hz: 128, name: 'Otto Somatic', note: 'C3', color: '#8E44AD' },
              { hz: 136.1, name: 'Cosmic OM', note: 'C#3', color: '#4EAA90' },
              { hz: 174, name: 'Grounding', note: 'F3', color: '#8B4513' },
              { hz: 285, name: 'Cellular', note: 'C#4', color: '#C25975' },
              { hz: 396, name: 'Liberation', note: 'G4', color: '#E74C3C' },
              { hz: 417, name: 'Facilitating', note: 'G#4', color: '#E67E22' },
              { hz: 432, name: 'Verdi Sacred', note: 'A4', color: '#F39C12' },
              { hz: 528, name: 'Miracle DNA', note: 'C5', color: '#2ECC71' },
              { hz: 639, name: 'Heart Bridge', note: 'D#5', color: '#1ABC9C' },
              { hz: 741, name: 'Intuition', note: 'F#5', color: '#3498DB' },
              { hz: 852, name: 'Third Eye', note: 'G#5', color: '#9B59B6' },
              { hz: 963, name: 'Crown Transcend', note: 'B5', color: '#E056FD' },
              { hz: 1074, name: 'Transpersonal', note: 'C6', color: '#A29BFE' },
            ].map((bowl) => (
              <div
                key={bowl.hz}
                onClick={() => handleStrikeBowl(bowl.hz)}
                className="group cursor-pointer rounded-2xl bg-[#0A0E27]/80 hover:bg-white/10 border border-white/10 hover:border-white/30 p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col items-center justify-between gap-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner"
                  style={{
                    backgroundColor: `${bowl.color}20`,
                    border: `2px solid ${bowl.color}`,
                    boxShadow: `0 0 20px ${bowl.color}30`,
                  }}
                >
                  <Music className="w-6 h-6" style={{ color: bowl.color }} />
                </div>

                <div>
                  <div className="text-xs font-mono font-bold" style={{ color: bowl.color }}>
                    {bowl.hz} Hz · {bowl.note}
                  </div>
                  <div className="text-sm font-medium text-slate-100 mt-0.5">{bowl.name}</div>
                </div>

                <button className="w-full py-1.5 rounded-xl bg-white/5 group-hover:bg-[#E8C170] group-hover:text-[#0A0E27] text-xs font-mono text-slate-300 transition-colors border border-white/10">
                  {selectedBowlType === 'gongzilla' || bowl.hz <= 108 ? 'Strike Gong Mallet' : selectedBowlType === 'tuning-fork' ? 'Strike Fork' : 'Strike Mallet'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BRAINWAVE ENTRAINMENT & BINAURAL BEATS */}
      {activeTab === 'brainwaves' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/30 via-indigo-950/30 to-[#0A0E27] border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">Binaural Brainwave Entrainment</h3>
                <p className="text-xs text-slate-300 font-light mt-0.5 max-w-xl">
                  Best experienced with headphones. Two slightly shifted frequencies feed the left and right auditory cortex to naturally nudge brainwaves into Delta, Theta, Alpha, Beta, or Gamma states.
                </p>
              </div>
            </div>

            {/* Carrier Pitch Choice */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] font-mono text-slate-400">Carrier:</span>
              {[136.1, 432, 528].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    const bin = frequencyState.binaural || { enabled: true, mode: 'alpha', beatHz: 10, carrierHz: 432, gain: 0.25 };
                    onChangeFrequencyState({
                      binaural: { ...bin, carrierHz: c },
                    });
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    (frequencyState.binaural?.carrierHz || 432) === c
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c} Hz
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAINWAVE_PRESETS.map((preset) => {
              const isCurrent = frequencyState.binaural?.enabled && frequencyState.binaural.mode === preset.mode;
              const carrier = frequencyState.binaural?.carrierHz || 432;
              const leftEar = carrier;
              const rightEar = (carrier + preset.beatHz).toFixed(2);

              return (
                <div
                  key={preset.mode}
                  className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-400 shadow-xl shadow-indigo-500/10'
                      : 'bg-[#0A0E27]/80 hover:bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {preset.range}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Δ {preset.beatHz} Hz
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-slate-100">{preset.name}</h4>
                      <p className="text-xs text-indigo-200 font-mono text-[11px]">{preset.state}</p>
                      <p className="text-xs text-slate-400 font-light mt-1.5">{preset.description}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                      <span>L: {leftEar} Hz</span>
                      <span className="text-indigo-400">↔</span>
                      <span>R: {rightEar} Hz</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleBinaural(preset.mode, preset.beatHz)}
                    className={`w-full mt-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                      isCurrent
                        ? 'bg-indigo-500 text-white font-semibold'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    {isCurrent ? 'Active Binaural Stream' : 'Engage Brainwave'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRECISION FREQUENCY WAND & CUSTOM DIAL */}
      {activeTab === 'wand' && (
        <div className="bg-[#0b102b]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-medium text-slate-100">Continuous Precision Frequency Wand</h3>
              <p className="text-xs text-slate-400">Dial in any frequency from 1 Hz to 1200 Hz with smooth real-time pitch sliding.</p>
            </div>

            <div className="text-3xl font-mono font-bold text-[#3ADBC4]">
              {customDialHz.toFixed(1)} <span className="text-lg font-light text-slate-400">Hz</span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="20"
              max="1000"
              step="0.5"
              value={customDialHz}
              onChange={(e) => handleApplyCustomHz(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>20 Hz (Deep Sub)</span>
              <span>136.1 Hz (Om)</span>
              <span>432 Hz (Verdi)</span>
              <span>528 Hz (Love)</span>
              <span>741 Hz</span>
              <span>1000 Hz</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Instant Tuning Anchors:</span>
            {[7.83, 40, 111, 136.1, 174, 285, 396, 417, 432, 528, 639, 741, 852, 963].map((val) => (
              <button
                key={val}
                onClick={() => handleApplyCustomHz(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  Math.abs(customDialHz - val) < 0.1
                    ? 'bg-[#3ADBC4] text-[#0A0E27] font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {val} Hz
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
