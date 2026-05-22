import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill } from '../../ui/Pill';

export const OutroScene: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ padding: 92, justifyContent: 'center' }}>
      <div style={{ opacity }}>
        <Pill text="Hazır mısın?" tone="violet" />
        <div style={{ marginTop: 18, fontSize: 62, fontWeight: 950, color: 'white', lineHeight: 1.05 }}>
          LetMeFind ile
          <br />
          en doğru seçimi yap
        </div>
        <div style={{ marginTop: 20, fontSize: 22, color: 'rgba(255,255,255,0.85)', maxWidth: 900 }}>
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
