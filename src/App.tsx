/**
 * Aeon — The Living Symphony of Earth
 * Main Application Component
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WorldParameters, AppMode, LocalFrequencyData, MomentSnapshot, ResonanceRoom } from './types';
import { globalAudioEngine } from './services/audioEngine';
import { globalDataStream } from './services/dataStreamService';
import { INITIAL_MOMENTS, INITIAL_ROOMS } from './data/initialData';

import { AuroraVisualizer } from './components/AuroraVisualizer';
import { HeaderNav } from './components/HeaderNav';
import { GlobalPulseView } from './components/GlobalPulseView';
import { MyFrequencyView } from './components/MyFrequencyView';
import { MomentsView } from './components/MomentsView';
import { ResonanceRoomsView } from './components/ResonanceRoomsView';
import { BreathModeView } from './components/BreathModeView';
import { PlanetaryTunerModal } from './components/PlanetaryTunerModal';

export default function App() {
  // Navigation & Active View Mode
  const [currentMode, setCurrentMode] = useState<AppMode>('pulse');

  // Audio Engine & Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);

  // Planetary Parameters Stream
  const [parameters, setParameters] = useState<WorldParameters>(() => globalDataStream.getCurrent());
  const [isTunerOpen, setIsTunerOpen] = useState<boolean>(false);

  // My Frequency State
  const [myFrequencyEnabled, setMyFrequencyEnabled] = useState<boolean>(true);
  const [myFrequencyVolume, setMyFrequencyVolume] = useState<number>(0.45);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [localFrequency, setLocalFrequency] = useState<LocalFrequencyData>({
    city: 'Reykjavik',
    country: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperatureC: 6,
    condition: 'mist',
    windKmh: 24,
    humidity: 82,
    sunElevation: 14,
    instrumentVoice: 'nocturnal-glass',
  });

  // Moments Collection State
  const [moments, setMoments] = useState<MomentSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem('aeon_saved_moments');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MOMENTS;
  });
  const [activePlayingMomentId, setActivePlayingMomentId] = useState<string | null>(null);

  // Resonance Rooms State
  const [rooms, setRooms] = useState<ResonanceRoom[]>(() => {
    try {
      const saved = localStorage.getItem('aeon_saved_rooms');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ROOMS;
  });
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  // Breath Mode State
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathProgress, setBreathProgress] = useState<number>(0);

  // Chrome Auto-fade on 3s Inactivity
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = window.setTimeout(() => {
      setIsIdle(true);
    }, 3500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    };
  }, [resetIdleTimer]);

  // Subscribe to Planetary Data Stream
  useEffect(() => {
    globalDataStream.start(6000);
    const unsubscribe = globalDataStream.subscribe((newParams) => {
      setParameters(newParams);
      if (isPlaying && !activePlayingMomentId) {
        globalAudioEngine.updateParameters(newParams, 3.0);
      }
    });

    return () => {
      unsubscribe();
      globalDataStream.stop();
    };
  }, [isPlaying, activePlayingMomentId]);

  // Sync My Frequency Layer to Audio Engine
  useEffect(() => {
    globalAudioEngine.setLocalFrequency(localFrequency, myFrequencyEnabled, myFrequencyVolume);
  }, [localFrequency, myFrequencyEnabled, myFrequencyVolume]);

  // Toggle Play / Tune In
  const handleTogglePlay = async () => {
    if (isPlaying) {
      globalAudioEngine.stop();
      setIsPlaying(false);
    } else {
      const ok = await globalAudioEngine.start();
      if (ok) {
        setIsPlaying(true);
        globalAudioEngine.updateParameters(parameters, 1.5);
      }
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = globalAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Adjust Master Volume
  const handleChangeVolume = (vol: number) => {
    setMasterVolume(vol);
    globalAudioEngine.setMasterVolume(vol);
  };

  // Manual Parameter Update via Tuner
  const handleUpdateParameters = (partial: Partial<WorldParameters>) => {
    setActivePlayingMomentId(null);
    globalDataStream.setParameters(partial);
    const updated = { ...parameters, ...partial };
    setParameters(updated);
    if (isPlaying) {
      globalAudioEngine.updateParameters(updated, 1.2);
    }
  };

  // Reset to live feed
  const handleResetToLive = () => {
    setActivePlayingMomentId(null);
    const baseline = globalDataStream.computeBaselinePlanetaryParameters();
    globalDataStream.setParameters(baseline);
    setParameters(baseline);
    if (isPlaying) {
      globalAudioEngine.updateParameters(baseline, 2.0);
    }
  };

  // Save Moment
  const handleSaveMoment = (title: string, description: string, tags: string[]) => {
    const newMoment: MomentSnapshot = {
      id: `moment-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString(),
      dataSnapshot: { ...parameters },
      localContext: {
        locationName: `${localFrequency.city}, ${localFrequency.country}`,
        condition: localFrequency.condition,
      },
      tags,
    };

    const updated = [newMoment, ...moments];
    setMoments(updated);
    try {
      localStorage.setItem('aeon_saved_moments', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Play Snapshot Moment
  const handlePlayMoment = async (moment: MomentSnapshot) => {
    if (activePlayingMomentId === moment.id) {
      // Unload snapshot, return to live
      setActivePlayingMomentId(null);
      handleResetToLive();
      return;
    }

    setActivePlayingMomentId(moment.id);
    setParameters(moment.dataSnapshot);

    if (!isPlaying) {
      const ok = await globalAudioEngine.start();
      if (ok) setIsPlaying(true);
    }

    globalAudioEngine.updateParameters(moment.dataSnapshot, 2.5);
  };

  // Delete Moment
  const handleDeleteMoment = (id: string) => {
    const updated = moments.filter((m) => m.id !== id);
    setMoments(updated);
    if (activePlayingMomentId === id) {
      setActivePlayingMomentId(null);
      handleResetToLive();
    }
    try {
      localStorage.setItem('aeon_saved_moments', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = pos.coords;

        // Estimate local solar elevation
        const utcHour = new Date().getUTCHours();
        const solarHour = (utcHour + longitude / 15 + 24) % 24;
        const sunElev = Math.round(Math.sin(((solarHour - 6) / 12) * Math.PI) * 65);

        const updated: LocalFrequencyData = {
          city: 'Local Meridian',
          country: `${latitude.toFixed(1)}°N, ${longitude.toFixed(1)}°E`,
          lat: latitude,
          lng: longitude,
          localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperatureC: 19,
          condition: sunElev > 0 ? 'clear' : 'night',
          windKmh: 12,
          humidity: 65,
          sunElevation: sunElev,
          instrumentVoice: sunElev > 0 ? 'solar-strings' : 'nocturnal-glass',
        };

        setLocalFrequency(updated);
      },
      () => {
        setIsDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  // Create Resonance Room
  const handleCreateRoom = (name: string, description: string) => {
    const newRoom: ResonanceRoom = {
      id: `room-${Date.now()}`,
      name,
      description,
      hostId: 'me',
      createdAt: new Date().toISOString(),
      activeCount: 1,
      roomMood: 'aurora-zenith',
      participants: [
        {
          id: `p-${Date.now()}`,
          name: 'You',
          location: `${localFrequency.city}, ${localFrequency.country}`,
          coordinates: [localFrequency.lat, localFrequency.lng],
          localTime: localFrequency.localTime,
          condition: localFrequency.condition,
          harmonicNote: 'D4',
          isHost: true,
        },
      ],
    };

    const updated = [newRoom, ...rooms];
    setRooms(updated);
    setCurrentRoomId(newRoom.id);
    try {
      localStorage.setItem('aeon_saved_rooms', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Join Resonance Room
  const handleJoinRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id === roomId) {
          const exists = r.participants.some((p) => p.name === 'You');
          if (!exists) {
            return {
              ...r,
              activeCount: r.activeCount + 1,
              participants: [
                ...r.participants,
                {
                  id: `p-${Date.now()}`,
                  name: 'You',
                  location: `${localFrequency.city}, ${localFrequency.country}`,
                  coordinates: [localFrequency.lat, localFrequency.lng],
                  localTime: localFrequency.localTime,
                  condition: localFrequency.condition,
                  harmonicNote: 'A4',
                },
              ],
            };
          }
        }
        return r;
      })
    );
  };

  // Leave Resonance Room
  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
  };

  // Update Breath Progress
  const handleUpdateBreathState = (phase: 'inhale' | 'hold' | 'exhale' | 'pause', progress: number) => {
    setBreathPhase(phase);
    setBreathProgress(progress);
  };

  return (
    <main
      id="aeon-app-root"
      className="relative w-screen h-screen overflow-hidden bg-[#0A0E27] select-none text-slate-100"
    >
      {/* 1. Generative Full-Viewport Canvas Aurora & Nebula Visualizer */}
      <AuroraVisualizer
        parameters={parameters}
        isPlaying={isPlaying}
        breathModeActive={currentMode === 'breath'}
        breathProgress={breathProgress}
        breathPhase={breathPhase}
      />

      {/* 2. Top Navigation & Audio Chrome */}
      <HeaderNav
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={handleTogglePlay}
        onToggleMute={handleToggleMute}
        masterVolume={masterVolume}
        onChangeVolume={handleChangeVolume}
        onOpenTuner={() => setIsTunerOpen(true)}
        isIdle={isIdle && isPlaying}
      />

      {/* 3. Feature Views */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        {currentMode === 'pulse' && (
          <GlobalPulseView
            parameters={parameters}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onCaptureMoment={() => setCurrentMode('moments')}
            onOpenTuner={() => setIsTunerOpen(true)}
          />
        )}

        {currentMode === 'my-frequency' && (
          <MyFrequencyView
            localData={localFrequency}
            isEnabled={myFrequencyEnabled}
            volume={myFrequencyVolume}
            onToggleEnabled={setMyFrequencyEnabled}
            onChangeVolume={setMyFrequencyVolume}
            onSelectCity={setLocalFrequency}
            onDetectLocation={handleDetectLocation}
            isDetecting={isDetectingLocation}
          />
        )}

        {currentMode === 'moments' && (
          <MomentsView
            moments={moments}
            currentParameters={parameters}
            onSaveMoment={handleSaveMoment}
            onPlayMoment={handlePlayMoment}
            onDeleteMoment={handleDeleteMoment}
            activePlayingMomentId={activePlayingMomentId}
          />
        )}

        {currentMode === 'rooms' && (
          <ResonanceRoomsView
            rooms={rooms}
            currentRoomId={currentRoomId}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
            onCreateRoom={handleCreateRoom}
            myLocationName={localFrequency.city}
          />
        )}

        {currentMode === 'breath' && (
          <BreathModeView
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onUpdateBreathState={handleUpdateBreathState}
          />
        )}
      </div>

      {/* 4. Planetary Parameter Tuner Modal */}
      <PlanetaryTunerModal
        isOpen={isTunerOpen}
        onClose={() => setIsTunerOpen(false)}
        parameters={parameters}
        onUpdateParameters={handleUpdateParameters}
        onResetToLive={handleResetToLive}
      />
    </main>
  );
}
