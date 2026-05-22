import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const Title: React.FC<{ text: string; subtext: string; appearFrame: number }> = ({ text, subtext, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [appearFrame, appearFrame + fps * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(frame, [appearFrame, appearFrame + fps * 0.8], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', letterSpacing: 1.8, textTransform: 'uppercase' }}>{subtext}</div>
      <div style={{ fontSize: 54, lineHeight: 1.05, fontWeight: 850, color: 'white', marginTop: 10, maxWidth: 1200 }}>{text}</div>
    </div>
  );
};
