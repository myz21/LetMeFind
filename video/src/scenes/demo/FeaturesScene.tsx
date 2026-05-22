import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill } from '../../ui/Pill';

export const FeaturesScene: React.FC<{
  features: Array<{ title: string; text: string }>;
}> = ({ features }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ padding: 72 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pill text="Diğer özellikler" tone="cyan" />
        <Pill text="LetMeFind" tone="neutral" />
      </div>

      <div
        style={{
          marginTop: 38,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 18,
          maxWidth: 1200,
        }}
      >
        {features.map((f, i) => {
          const appear = interpolate(frame, [i * (fps * 0.6), i * (fps * 0.6) + fps * 0.8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const y = interpolate(frame, [i * (fps * 0.6), i * (fps * 0.6) + fps * 0.8], [14, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={f.title}
              style={{
                opacity: appear,
                transform: `translateY(${y}px)`,
                borderRadius: 28,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                padding: 22,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{f.title}</div>
              <div style={{ marginTop: 10, fontSize: 18, lineHeight: 1.35, color: 'rgba(255,255,255,0.84)' }}>{f.text}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', maxWidth: 980, fontSize: 40, fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
        Daha az arama.
        <br />
        Daha çok odak.
      </div>
    </AbsoluteFill>
  );
};
