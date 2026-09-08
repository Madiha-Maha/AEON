/**
 * Aeon — The Living Symphony of Earth
 * My Frequency View
 *
 * Blends user's local weather and local time as a personal instrumental layer
 * on top of the shared global bed.
 */

import React, { useState } from 'react';
import { LocalFrequencyData } from '../types';
import { MapPin, Navigation, Sparkles, Volume2, CloudSun, Wind, Droplets, Sun, Moon } from 'lucide-react';

interface MyFrequencyViewProps {
  localData: LocalFrequencyData;
  isEnabled: boolean;
  volume: number;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeVolume: (vol: number) => void;
  onSelectCity: (data: LocalFrequencyData) => void;
  onDetectLocation: () => void;
  isDetecting: boolean;
}

const PRESET_LOCATIONS: LocalFrequencyData[] = [
  {
    city: 'Reykjavik',
    country: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    localTime: '09:00',
    temperatureC: 4,
    condition: 'mist',
    windKmh: 28,
    humidity: 84,
    sunElevation: 12,
    instrumentVoice: 'nocturnal-glass',
  },
  {
    city: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    localTime: '18:00',
    temperatureC: 18,
    condition: 'rain',
    windKmh: 9,
    humidity: 78,
    sunElevation: -5,
    instrumentVoice: 'celesta-drops',
  },
  {
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    localTime: '02:00',
    temperatureC: 13,
    condition: 'mist',
    windKmh: 14,
    humidity: 88,
    sunElevation: -48,
    instrumentVoice: 'twilight-flute',
  },
  {
    city: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    localTime: '12:00',
    temperatureC: 32,
    condition: 'clear',
    windKmh: 16,
    humidity: 32,
    sunElevation: 68,
    instrumentVoice: 'solar-strings',
  },
  {
    city: 'Honolulu',
    country: 'Hawaii',
    lat: 21.3069,
    lng: -157.8583,
    localTime: '23:00',
    temperatureC: 24,
    condition: 'night',
    windKmh: 19,
    humidity: 71,
    sunElevation: -52,
    instrumentVoice: 'crystalline-pad',
  },
];

export const MyFrequencyView: React.FC<MyFrequencyViewProps> = ({
  localData,
  isEnabled,
  volume,
  onToggleEnabled,
  onChangeVolume,
  onSelectCity,
  onDetectLocation,
  isDetecting,
}) => {
  const [activeVoice, setActiveVoice] = useState(localData.instrumentVoice);

  const voices = [
    { id: 'celesta-drops', name: 'Celesta Rain Droplets', desc: 'High crystalline harmonic bell drops' },
    { id: 'twilight-flute', name: 'Twilight Flute', desc: 'Airy, soft woodwind resonance' },
    { id: 'solar-strings', name: 'Solar Dawn Strings', desc: 'Warm overtones tuned to solar zenith' },
    { id: 'nocturnal-glass', name: 'Nocturnal Glass Harp', desc: 'Subtle ethereal high-frequency shimmer' },
    { id: 'crystalline-pad', name: 'Crystalline Ocean Pad', desc: 'Gentle tidal swelling harmonic choir' },
  ];

  const handleVoiceChange = (voiceId: LocalFrequencyData['instrumentVoice']) => {
    setActiveVoice(voiceId);
    onSelectCity({
      ...localData,
      instrumentVoice: voiceId,
    });
  };

  return (
    <div id="my-frequency-view" className="relative z-10 w-full min-h-full flex flex-col justify-center items-center p-4 sm:p-8 pt-24 pb-16">
      <div className="max-w-4xl w-full backdrop-blur-xl bg-[#0A0E27]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3ADBC4] font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Sonic Harmony</span>
            </div>
            <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-light text-slate-100">
              My Frequency
            </h2>
            <p className="text-sm text-slate-300 font-light mt-1">
              Your location and regional skies quietly weave a personalized texture into Earth’s shared score.
            </p>
          </div>

          {/* Master Layer Toggle */}
          <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-full border border-white/10 self-start sm:self-auto">
            <span className="text-xs text-slate-300 font-medium">Blend Layer</span>
            <button
              id="my-frequency-toggle-btn"
              onClick={() => onToggleEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-[#3ADBC4]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#0A0E27] transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Current Active Frequency Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Location Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#3ADBC4]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-mono tracking-wider">Current Node</span>
                <MapPin className="w-4 h-4 text-[#3ADBC4]" />
              </div>
              <div className="text-2xl font-serif-cormorant text-slate-100 font-light">
                {localData.city}, <span className="text-slate-400 text-lg">{localData.country}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300 font-mono">
                <span>{localData.localTime} Local</span>
                <span>•</span>
                <span>{localData.temperatureC}°C</span>
              </div>
            </div>

            <button
              onClick={onDetectLocation}
              disabled={isDetecting}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 transition-colors disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting GPS...' : 'Use My Geolocation'}</span>
            </button>
          </div>

          {/* Sky & Sun Telemetry */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-mono tracking-wider">Sky Texture</span>
                <CloudSun className="w-4 h-4 text-[#E8C170]" />
              </div>
              <div className="text-2xl font-serif-cormorant text-slate-100 font-light capitalize">
                {localData.condition} Atmosphere
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-slate-400" />
                  <span>{localData.windKmh} km/h wind</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-slate-400" />
                  <span>{localData.humidity}% humidity</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-white/5">
              <span>Sun Altitude:</span>
              <span className="text-[#E8C170]">{localData.sunElevation}° {localData.sunElevation > 0 ? <Sun className="inline w-3 h-3 ml-1" /> : <Moon className="inline w-3 h-3 ml-1" />}</span>
            </div>
          </div>

          {/* Personal Volume & Voice Fader */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-mono tracking-wider">Harmony Blend</span>
                <Volume2 className="w-4 h-4 text-[#3ADBC4]" />
              </div>
              <div className="text-2xl font-serif-cormorant text-slate-100 font-light">
                {Math.round(volume * 100)}% Volume
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Balance between the shared planetary score and your personal frequency.
              </p>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
              />
            </div>
          </div>
        </div>

        {/* Instrumental Voice Selection */}
        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-slate-400 mb-3">
            Personal Instrumental Voice
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {voices.map((v) => {
              const isSelected = activeVoice === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleVoiceChange(v.id as LocalFrequencyData['instrumentVoice'])}
                  className={`text-left p-3.5 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-[#3ADBC4]/10 border-[#3ADBC4]/50 shadow-sm shadow-[#3ADBC4]/20'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="text-sm font-medium text-slate-100 mb-0.5">{v.name}</div>
                  <div className="text-xs text-slate-400 font-light">{v.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Planetary Preset Nodes */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-slate-400 mb-3">
            Or Choose a Sanctuary Node
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PRESET_LOCATIONS.map((loc) => {
              const isCurrent = loc.city === localData.city;
              return (
                <button
                  key={loc.city}
                  onClick={() => {
                    onSelectCity(loc);
                    setActiveVoice(loc.instrumentVoice);
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    isCurrent
                      ? 'bg-[#E8C170]/15 border-[#E8C170]/40 text-[#E8C170]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium truncate">{loc.city}</div>
                  <div className="text-[10px] text-slate-400 truncate">{loc.country}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{loc.temperatureC}°C · {loc.condition}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
