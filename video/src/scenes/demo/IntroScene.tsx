import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [0, fps * 0.9], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        padding: 96,
        display: 'flex',
        justifyContent: 'center',
        background:
          'radial-gradient(1200px 500px at 30% 40%, rgba(0,229,255,0.16), rgba(11,12,16,0) 70%), radial-gradient(900px 500px at 70% 60%, rgba(167,139,250,0.16), rgba(11,12,16,0) 70%), #0b0c10',
      }}
    >
      <div style={{ opacity, transform: `translateY(${y}px)` }}>
        <div style={{ fontSize: 18, letterSpacing: 2.6, color: 'rgba(255,255,255,0.72)', fontWeight: 800 }}>
          LETMEFIND DEMO
        </div>
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1.05 }}>
          Doğru ürünü
          <br />
          daha hızlı bul
        </div>
        <div style={{ marginTop: 18, fontSize: 22, color: 'rgba(255,255,255,0.82)', maxWidth: 900, lineHeight: 1.35 }}>
          Öğrenciler için: bütçeye uygun, net öneriler.
        </div>
      </div>
    </AbsoluteFill>
  );
};
