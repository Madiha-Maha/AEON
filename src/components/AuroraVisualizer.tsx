/**
 * Aeon — The Living Symphony of Earth
 * Aurora Visualizer Component
 *
 * Full-viewport canvas generative cosmic aurora, nebula, and planetary resonance field.
 * Reacts directly to live WorldParameters and real-time audio FFT frequency analysis.
 */

import React, { useEffect, useRef } from 'react';
import { WorldParameters } from '../types';
import { globalAudioEngine } from '../services/audioEngine';

interface AuroraVisualizerProps {
  parameters: WorldParameters;
  isPlaying: boolean;
  breathModeActive?: boolean;
  breathProgress?: number;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'pause';
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  speedY: number;
  speedX: number;
  phase: number;
}

export const AuroraVisualizer: React.FC<AuroraVisualizerProps> = ({
  parameters,
  isPlaying,
  breathModeActive = false,
  breathProgress = 0,
  breathPhase = 'inhale',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Smooth local interpolators for visual fluidity
  const smoothedWeatherRef = useRef(parameters.weatherVolatility);
  const smoothedMarketRef = useRef(parameters.marketVolatility);
  const smoothedSentimentRef = useRef(parameters.newsSentiment);
  const smoothedSeismicRef = useRef(parameters.seismicActivity);
  const smoothedTerminatorRef = useRef(parameters.terminatorPhase);

  // Time accumulator
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Initialize background celestial starfield particles
      const count = Math.floor((width * height) / 10000);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.5 + Math.random() * 1.5,
          baseAlpha: 0.15 + Math.random() * 0.65,
          speedY: (Math.random() - 0.5) * 0.1,
          speedX: (Math.random() - 0.5) * 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    resize();
    window.addEventListener('resize', resize);

    // Audio frequency buffer
    const fftData = new Uint8Array(64);

    const render = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;

      // Smoothly interpolate towards current parameters
      const lerpSpeed = 0.05;
      smoothedWeatherRef.current += (parameters.weatherVolatility - smoothedWeatherRef.current) * lerpSpeed;
      smoothedMarketRef.current += (parameters.marketVolatility - smoothedMarketRef.current) * lerpSpeed;
      smoothedSentimentRef.current += (parameters.newsSentiment - smoothedSentimentRef.current) * lerpSpeed;
      smoothedSeismicRef.current += (parameters.seismicActivity - smoothedSeismicRef.current) * lerpSpeed;
      smoothedTerminatorRef.current += (parameters.terminatorPhase - smoothedTerminatorRef.current) * lerpSpeed;

      const weather = smoothedWeatherRef.current;
      const market = smoothedMarketRef.current;
      const sentiment = smoothedSentimentRef.current;
      const seismic = smoothedSeismicRef.current;
      const terminator = smoothedTerminatorRef.current;

      // Extract real-time audio FFT data if playing
      let audioEnergy = 0;
      let bassEnergy = 0;
      const analyser = globalAudioEngine.getAnalyser();
      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(fftData);
        let sum = 0;
        for (let i = 0; i < 32; i++) {
          sum += fftData[i];
          if (i < 8) bassEnergy += fftData[i];
        }
        audioEnergy = (sum / 32) / 255;
        bassEnergy = (bassEnergy / 8) / 255;
      }

      // 1. CLEAR & DEEP COSMIC SPACE BACKGROUND
      // Base dark indigo/near-black #0A0E27
      ctx.fillStyle = '#0A0E27';
      ctx.fillRect(0, 0, width, height);

      // 2. DAY/NIGHT TERMINATOR SOLAR GRADIENT (Curving planetary horizon)
      // Terminator phase shifts the subtle warm gold and twilight gradient
      const terminatorX = width * terminator;
      const terminatorGrad = ctx.createRadialGradient(
        terminatorX,
        height * 0.85,
        50,
        terminatorX,
        height * 0.85,
        width * 0.95
      );
      const goldAlpha = 0.08 + (1 - Math.abs(terminator - 0.5) * 2) * 0.12; // peaks at dawn/dusk
      terminatorGrad.addColorStop(0, `rgba(232, 193, 112, ${goldAlpha})`);
      terminatorGrad.addColorStop(0.4, 'rgba(30, 41, 88, 0.25)');
      terminatorGrad.addColorStop(1, 'rgba(10, 14, 39, 0)');
      ctx.fillStyle = terminatorGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. SEISMIC PLANETARY RIPPLES (Concentric deep harmonic rings)
      const seismicBasePulse = (Math.sin(t * (1.2 + seismic * 2.5)) + 1) * 0.5;
      const seismicRadius = (height * 0.35) + (seismicBasePulse * 140) + (bassEnergy * 80);
      const ringAlpha = (0.04 + seismic * 0.12 + bassEnergy * 0.15);

      ctx.save();
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.68, seismicRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232, 193, 112, ${ringAlpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.68, seismicRadius * 0.65, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(58, 219, 196, ${ringAlpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 4. CELESTIAL STARFIELD PARTICLES
      ctx.save();
      for (const p of particlesRef.current) {
        p.phase += 0.02;
        p.y += p.speedY * (1 + weather * 1.5);
        p.x += p.speedX;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const twinkle = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.fillStyle = `rgba(241, 245, 249, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. GENERATIVE AURORA BANDS (Multi-layered trigonometric wave curtain)
      // Color shifts based on news sentiment:
      // Positive (+1) -> luminous teal/emerald (#3ADBC4, #5EFCE8)
      // Negative (-1) -> celestial violet/deep indigo twilight
      const sentimentRatio = (sentiment + 1) / 2; // 0 to 1
      const auroraHue1 = 172 + (sentimentRatio - 0.5) * 35; // Teal/emerald range
      const auroraHue2 = 210 + (1 - sentimentRatio) * 60;   // Blue to violet range

      const layerCount = 3;
      for (let layer = 0; layer < layerCount; layer++) {
        ctx.save();
        ctx.beginPath();

        const speedMod = 0.8 + layer * 0.4;
        const waveTime = t * speedMod;
        const baseY = height * (0.32 + layer * 0.14);
        const waveAmp = (40 + layer * 25) * (0.8 + weather * 1.2) + (audioEnergy * 45);
        const freqX = 0.002 + layer * 0.0015;

        ctx.moveTo(0, height);

        // Compute smooth cubic wave
        const step = Math.max(8, Math.floor(width / 80));
        for (let x = 0; x <= width + step; x += step) {
          // Complex harmonic synthesis of wave crests
          const w1 = Math.sin(x * freqX + waveTime);
          const w2 = Math.sin(x * freqX * 2.3 - waveTime * 0.8) * 0.5;
          const w3 = Math.cos(x * 0.0008 + waveTime * 0.4) * 0.35;
          // Market volatility adds high-frequency harmonic flutter
          const marketFlutter = Math.sin(x * 0.02 + waveTime * 4) * (market * 14);

          const y = baseY + (w1 + w2 + w3) * waveAmp + marketFlutter;

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Aurora vertical gradient
        const auroraGrad = ctx.createLinearGradient(0, baseY - waveAmp * 1.5, 0, height);
        const alphaBase = 0.20 + layer * 0.08 + audioEnergy * 0.15;
        auroraGrad.addColorStop(0, `hsla(${auroraHue1}, 75%, 60%, 0)`);
        auroraGrad.addColorStop(0.2, `hsla(${auroraHue1}, 78%, 56%, ${alphaBase * 0.7})`);
        auroraGrad.addColorStop(0.5, `hsla(${auroraHue2}, 70%, 48%, ${alphaBase * 0.4})`);
        auroraGrad.addColorStop(1, 'rgba(10, 14, 39, 0)');

        ctx.fillStyle = auroraGrad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fill();
        ctx.restore();
      }

      // 6. BREATH MODE VISUAL GUIDANCE SPHERE (If active)
      if (breathModeActive) {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;

        let expansion = 0.5;
        if (breathPhase === 'inhale') {
          expansion = 0.3 + breathProgress * 0.7;
        } else if (breathPhase === 'hold') {
          expansion = 1.0;
        } else if (breathPhase === 'exhale') {
          expansion = 1.0 - breathProgress * 0.7;
        } else {
          expansion = 0.3;
        }

        const sphereRadius = 60 + expansion * 75;

        // Outer radiant aura
        const breathGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          sphereRadius * 0.2,
          centerX,
          centerY,
          sphereRadius * 2.2
        );
        breathGrad.addColorStop(0, 'rgba(58, 219, 196, 0.45)');
        breathGrad.addColorStop(0.4, 'rgba(232, 193, 112, 0.20)');
        breathGrad.addColorStop(1, 'rgba(10, 14, 39, 0)');

        ctx.fillStyle = breathGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, sphereRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(58, 219, 196, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#3ADBC4';
        ctx.shadowBlur = 24;
        ctx.stroke();

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [parameters, isPlaying, breathModeActive, breathProgress, breathPhase]);

  return (
    <canvas
      id="aeon-aurora-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
