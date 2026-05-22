import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill } from '../../ui/Pill';

export const ResultsScene: React.FC<{ stitchImage: string }> = ({ stitchImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = interpolate(frame, [0, fps * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const zoom = interpolate(frame, [0, fps * 6], [1.02, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.95 }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(11,12,16,0.55), rgba(11,12,16,0.12), rgba(11,12,16,0.70))' }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: 72, opacity: reveal }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill text="Sonuçlar" tone="violet" />
          <Pill text="LetMeFind" tone="neutral" />
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 980 }}>
          <Pill text="ANC" tone="cyan" />
          <Pill text="Hafif" tone="cyan" />
          <Pill text="Bütçe" tone="cyan" />
          <Pill text="Mikrofon" tone="cyan" />
        </div>

        <div style={{ marginTop: 'auto', maxWidth: 1050, fontSize: 42, fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
          Öneriler tek ekranda.
          <br />
          Karar vermek kolay.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
