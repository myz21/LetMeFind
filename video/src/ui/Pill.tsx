import React from 'react';

export const Pill: React.FC<{ text: string; tone: 'cyan' | 'violet' | 'neutral' }> = ({ text, tone }) => {
  const background =
    tone === 'cyan'
      ? 'rgba(0, 229, 255, 0.14)'
      : tone === 'violet'
        ? 'rgba(167, 139, 250, 0.14)'
        : 'rgba(255, 255, 255, 0.10)';

  const border =
    tone === 'cyan'
      ? 'rgba(0, 229, 255, 0.22)'
      : tone === 'violet'
        ? 'rgba(167, 139, 250, 0.22)'
        : 'rgba(255, 255, 255, 0.16)';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 14px',
        borderRadius: 999,
        border: `1px solid ${border}`,
        background,
        color: 'rgba(255,255,255,0.92)',
        fontSize: 14,
        fontWeight: 650,
      }}
    >
      {text}
    </div>
  );
};
