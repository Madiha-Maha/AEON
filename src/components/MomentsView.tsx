/**
 * Aeon — The Living Symphony of Earth
 * Moments View
 *
 * Snapshot a specific point in the living stream with its planetary data-fingerprint
 * attached — collectible, reproducible, and genuinely unrepeatable.
 */

import React, { useState } from 'react';
import { MomentSnapshot, WorldParameters, FrequencyLayerState } from '../types';
import { Bookmark, Play, Share2, Download, Trash2, Plus, Sparkles, Check, Clock, Radio, Waves } from 'lucide-react';

interface MomentsViewProps {
  moments: MomentSnapshot[];
  currentParameters: WorldParameters;
  frequencyState?: FrequencyLayerState;
  onSaveMoment: (title: string, description: string, tags: string[]) => void;
  onPlayMoment: (snapshot: MomentSnapshot) => void;
  onDeleteMoment: (id: string) => void;
  activePlayingMomentId: string | null;
}

export const MomentsView: React.FC<MomentsViewProps> = ({
  moments,
  currentParameters,
  frequencyState,
  onSaveMoment,
  onPlayMoment,
  onDeleteMoment,
  activePlayingMomentId,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('earth, ambient, pulse');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const tagList = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSaveMoment(newTitle, newDesc, tagList);
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const handleShare = (m: MomentSnapshot) => {
    const fingerprint = JSON.stringify({
      id: m.id,
      title: m.title,
      timestamp: m.createdAt,
      data: m.dataSnapshot,
    });
    navigator.clipboard.writeText(fingerprint);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (m: MomentSnapshot) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(m, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aeon-moment-${m.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="moments-view" className="relative z-10 w-full min-h-full flex flex-col items-center p-4 sm:p-8 pt-24 pb-16">
      <div className="max-w-5xl w-full backdrop-blur-xl bg-[#0A0E27]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E8C170] font-medium mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Celestial Artifacts</span>
            </div>
            <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-light text-slate-100">
              Saved Moments
            </h2>
            <p className="text-sm text-slate-300 font-light mt-1">
              Snapshot a specific point in Earth’s living stream. Each artifact preserves the exact planetary fingerprint of that moment.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8C170] text-[#0A0E27] font-semibold text-xs tracking-wider uppercase hover:bg-[#F2D48E] transition-all shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Capture Now</span>
          </button>
        </div>

        {/* Create Snapshot Modal / Form */}
        {isCreating && (
          <form
            onSubmit={handleCreateSubmit}
            className="mb-8 p-6 rounded-2xl bg-white/[0.04] border border-[#E8C170]/30 animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-cormorant text-xl font-light text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E8C170]" />
                Preserve Current Living Stream
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Timestamp: {new Date(currentParameters.timestamp).toLocaleTimeString()} UTC
              </span>
            </div>

            {/* Current Snapshot Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-4 p-3 rounded-xl bg-black/40 text-center font-mono text-[11px] text-slate-300">
              <div>Weather: {Math.round(currentParameters.weatherVolatility * 100)}%</div>
              <div>Markets: {Math.round(currentParameters.marketVolatility * 100)}%</div>
              <div>Sentiment: {currentParameters.newsSentiment.toFixed(2)}</div>
              <div>Seismic: {Math.round(currentParameters.seismicActivity * 100)}%</div>
              <div>Terminator: {Math.round(currentParameters.terminatorPhase * 100)}%</div>
              <div className="text-[#3ADBC4]">
                Tuning: {frequencyState?.stressRegulation ? '396/528Hz Stress-Reg' : frequencyState && frequencyState.preset !== 'none' ? `${frequencyState.hz}Hz` : 'Natural'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">
                  Moment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solstice Twilight Over the Atlantic"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#E8C170]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">
                  Contemplation / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="What was happening on Earth at this moment?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#E8C170]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#E8C170]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E8C170] text-[#0A0E27] text-xs font-semibold uppercase tracking-wider hover:bg-[#F2D48E]"
                >
                  Save Artifact
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Moments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moments.map((m) => {
            const isActive = activePlayingMomentId === m.id;
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl transition-all border flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#E8C170]/10 border-[#E8C170]/50 shadow-md shadow-[#E8C170]/15'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-serif-cormorant text-xl font-medium text-slate-100 leading-snug">
                        {m.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(m.createdAt).toLocaleDateString()} · {new Date(m.createdAt).toLocaleTimeString()}</span>
                        </span>
                        {m.frequencyLayer && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-[#3ADBC4]/15 text-[#3ADBC4] border border-[#3ADBC4]/30">
                            <Waves className="w-2.5 h-2.5" />
                            {m.frequencyLayer.stressRegulation
                              ? '396/528Hz Stress-Reg'
                              : m.frequencyLayer.preset !== 'none'
                              ? `${m.frequencyLayer.hz}Hz Bed`
                              : 'Natural'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play/Recreate Button */}
                    <button
                      onClick={() => onPlayMoment(m)}
                      className={`p-2.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-[#E8C170] text-[#0A0E27]'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                      }`}
                      title={isActive ? 'Currently reproducing this moment' : 'Reproduce this moment in audio engine'}
                    >
                      {isActive ? <Radio className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>

                  {m.description && (
                    <p className="text-xs text-slate-300 font-light mt-2 line-clamp-2">
                      {m.description}
                    </p>
                  )}

                  {/* Planetary Fingerprint Pill Chips */}
                  <div className="grid grid-cols-5 gap-1.5 mt-4 p-2 rounded-xl bg-black/30 text-center font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 block">WTH</span>
                      <span className="text-[#3ADBC4]">{Math.round(m.dataSnapshot.weatherVolatility * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">MKT</span>
                      <span className="text-[#E8C170]">{Math.round(m.dataSnapshot.marketVolatility * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SNT</span>
                      <span className="text-emerald-400">{m.dataSnapshot.newsSentiment > 0 ? `+${m.dataSnapshot.newsSentiment.toFixed(1)}` : m.dataSnapshot.newsSentiment.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SEIS</span>
                      <span className="text-indigo-400">{Math.round(m.dataSnapshot.seismicActivity * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SOL</span>
                      <span className="text-amber-300">{Math.round(m.dataSnapshot.terminatorPhase * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Tags + Share/Download */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1">
                    {m.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => handleShare(m)}
                      title="Copy cryptographic data fingerprint"
                      className="p-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-[#3ADBC4]" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDownload(m)}
                      title="Download artifact JSON"
                      className="p-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMoment(m.id)}
                      title="Delete moment"
                      className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
