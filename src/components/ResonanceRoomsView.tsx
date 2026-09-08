/**
 * Aeon — The Living Symphony of Earth
 * Resonance Rooms View
 *
 * A collaborative ambient sanctuary — a "choir of places" where users in a shared
 * session each contribute their local data layer, blending into one collaborative
 * ambient piece in real time.
 */

import React, { useState } from 'react';
import { ResonanceRoom, ResonanceParticipant } from '../types';
import { Users, Globe, Plus, Volume2, Music, CheckCircle2, Radio, MapPin } from 'lucide-react';

interface ResonanceRoomsViewProps {
  rooms: ResonanceRoom[];
  currentRoomId: string | null;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onCreateRoom: (name: string, description: string) => void;
  myLocationName: string;
}

export const ResonanceRoomsView: React.FC<ResonanceRoomsViewProps> = ({
  rooms,
  currentRoomId,
  onJoinRoom,
  onLeaveRoom,
  onCreateRoom,
  myLocationName,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [choirBlend, setChoirBlend] = useState(0.65);

  const currentRoom = rooms.find((r) => r.id === currentRoomId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    onCreateRoom(roomName, roomDesc);
    setRoomName('');
    setRoomDesc('');
    setIsCreating(false);
  };

  return (
    <div id="resonance-rooms-view" className="relative z-10 w-full min-h-full flex flex-col items-center p-4 sm:p-8 pt-24 pb-16">
      <div className="max-w-5xl w-full backdrop-blur-xl bg-[#0A0E27]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3ADBC4] font-medium mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Choir of Places</span>
            </div>
            <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-light text-slate-100">
              Resonance Rooms
            </h2>
            <p className="text-sm text-slate-300 font-light mt-1">
              Join a collective planetary session where participants from distant time zones blend their local frequencies into one unified score.
            </p>
          </div>

          {!currentRoom && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3ADBC4] text-[#0A0E27] font-semibold text-xs tracking-wider uppercase hover:bg-[#5EFCE8] transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Host Sanctuary</span>
            </button>
          )}
        </div>

        {/* Create Room Form */}
        {isCreating && (
          <form
            onSubmit={handleCreate}
            className="mb-8 p-6 rounded-2xl bg-white/[0.04] border border-[#3ADBC4]/30 animate-in fade-in duration-300"
          >
            <h3 className="font-serif-cormorant text-xl font-light text-slate-100 mb-4">
              Open a New Resonance Sanctuary
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">
                  Sanctuary Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pacific Dawn Meditation"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#3ADBC4]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">
                  Intent & Atmosphere
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the mood or focus of this collaborative session..."
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#3ADBC4]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#3ADBC4] text-[#0A0E27] text-xs font-semibold uppercase tracking-wider hover:bg-[#5EFCE8]"
                >
                  Create Room
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ACTIVE ROOM DETAIL (If currently inside a room) */}
        {currentRoom ? (
          <div className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-[#3ADBC4]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#3ADBC4] font-mono uppercase tracking-wider mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ADBC4] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ADBC4]"></span>
                  </span>
                  <span>Connected to Sanctuary</span>
                </div>
                <h3 className="font-serif-cormorant text-2xl font-light text-slate-100">
                  {currentRoom.name}
                </h3>
                <p className="text-xs text-slate-300 font-light mt-0.5">{currentRoom.description}</p>
              </div>

              <button
                onClick={onLeaveRoom}
                className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs tracking-wider uppercase self-start sm:self-auto transition-colors"
              >
                Leave Sanctuary
              </button>
            </div>

            {/* Choir Blending Slider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/30 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <Volume2 className="w-4 h-4 text-[#3ADBC4]" />
                  <span>Choir Blending Balance</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mix level of connected planetary nodes into your audio stream.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-64">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={choirBlend}
                  onChange={(e) => setChoirBlend(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3ADBC4]"
                />
                <span className="text-xs font-mono text-[#3ADBC4] min-w-[3ch]">
                  {Math.round(choirBlend * 100)}%
                </span>
              </div>
            </div>

            {/* Participants Constellation Map / List */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                <span>Joined Planetary Nodes ({currentRoom.participants.length})</span>
                <span>Contributing Voice</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentRoom.participants.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3ADBC4]/10 border border-[#3ADBC4]/30 flex items-center justify-center text-[#3ADBC4]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.location.includes(myLocationName) && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#3ADBC4]/20 text-[#3ADBC4]">YOU</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{p.location}</span>
                          <span>·</span>
                          <span className="font-mono">{p.localTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E8C170]/15 text-[#E8C170] border border-[#E8C170]/30">
                        {p.harmonicNote}
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{p.condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Available Rooms Grid */}
        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-slate-400 mb-4">
          Active Sanctuaries Around the Globe
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((r) => {
            const isInside = currentRoomId === r.id;
            return (
              <div
                key={r.id}
                className={`p-5 rounded-2xl transition-all border flex flex-col justify-between ${
                  isInside
                    ? 'bg-[#3ADBC4]/10 border-[#3ADBC4]/40'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-serif-cormorant text-xl font-medium text-slate-100">
                        {r.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-light mt-1">{r.description}</p>
                    </div>

                    <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      <Radio className="w-3 h-3 text-[#3ADBC4]" />
                      <span>{r.activeCount} nodes</span>
                    </span>
                  </div>

                  {/* Sample Participant nodes preview */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.participants.slice(0, 3).map((p) => (
                      <span
                        key={p.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-mono"
                      >
                        {p.location}
                      </span>
                    ))}
                    {r.participants.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                        +{r.participants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Mood: {r.roomMood.replace('-', ' ')}
                  </span>

                  {isInside ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#3ADBC4] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onJoinRoom(r.id)}
                      className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-[#3ADBC4] hover:text-[#0A0E27] text-slate-200 text-xs font-medium tracking-wide transition-all border border-white/10"
                    >
                      Join Choir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
