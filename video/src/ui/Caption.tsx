import React from 'react';

export const Caption: React.FC<{ label: string; text: string; emphasize?: boolean }> = ({ label, text, emphasize }) => {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontSize: 12, letterSpacing: 2.0, color: 'rgba(255,255,255,0.62)', fontWeight: 750 }}>{label}</div>
      <div
        style={{
          fontSize: emphasize ? 20 : 24,
          lineHeight: 1.35,
          color: 'rgba(255,255,255,0.92)',
          fontWeight: emphasize ? 650 : 600,
          textShadow: '0 10px 30px rgba(0,0,0,0.35)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};
