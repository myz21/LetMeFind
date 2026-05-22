import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Caption } from '../../ui/Caption';
import { Pill } from '../../ui/Pill';
import { ensureTtsFile } from '../../tts/googleTts';

export const PromptScene: React.FC<{
  prompt: string;
  narration: string;
  enableTts: boolean;
}> = ({ prompt, narration, enableTts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = Math.floor(0.8 * fps);
  const zoomStart = Math.floor(2.2 * fps);
  const zoomEnd = Math.floor(6.5 * fps);

  const zoomProgress = interpolate(frame, [zoomStart, zoomEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoom = spring({ fps, frame: frame - zoomStart, config: { damping: 14, mass: 0.9 } });
  const zoomMix = Math.min(1, Math.max(0, zoomProgress)) * zoom;

  const ttsSrc = useMemo(() => {
    if (!enableTts) return null;
    return ensureTtsFile({ text: narration, id: `demo_prompt` });
  }, [enableTts, narration]);

  return (
    <AbsoluteFill style={{ padding: 84 }}>
      {ttsSrc ? <Audio src={ttsSrc} startFrom={intro} volume={1} /> : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pill text="Prompt'u yaz" tone="cyan" />
        <Pill text="LetMeFind" tone="neutral" />
      </div>

      <div style={{ marginTop: 30, maxWidth: 1200 }}>
        <div
          style={{
            borderRadius: 30,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            padding: 26,
            transformOrigin: 'left top',
            transform: `scale(${1 + 0.28 * zoomMix}) translateY(${-(16 * zoomMix)}px)`,
            boxShadow: zoomMix > 0.2 ? '0 30px 90px rgba(0,0,0,0.4)' : 'none',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Caption label="PROMPT" text={prompt} emphasize />
        </div>

        <div style={{ marginTop: 28, maxWidth: 980, opacity: interpolate(frame, [intro, intro + fps * 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <Caption label="NE OLUR?" text={narration} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
