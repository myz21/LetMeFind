import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Caption } from '../ui/Caption';
import { Pill } from '../ui/Pill';
import { Title } from '../ui/Title';
import { ensureTtsFile } from '../tts/geminiTts';

export const Segment: React.FC<{
  from: number;
  duration: number;
  variant: 'short' | 'long';
  label: string;
  title: string;
  prompt: string;
  narration: string;
  cta: string;
  stitchImage: string;
  enableTts: boolean;
  sfx?: { whoosh?: string; click?: string };
}> = ({
  from,
  duration,
  variant,
  label,
  title,
  prompt,
  narration,
  cta,
  stitchImage,
  enableTts,
  sfx,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - from;

  const intro = Math.floor(1.6 * fps);
  const zoomStart = Math.floor(4.0 * fps);
  const zoomEnd = Math.floor(10.0 * fps);
  const outroStart = Math.floor(25.5 * fps);

  const zoomProgress = interpolate(localFrame, [zoomStart, zoomEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const zoom = spring({
    fps,
    frame: localFrame - zoomStart,
    config: { damping: 14, mass: 0.9 },
  });
  const zoomMix = Math.min(1, Math.max(0, zoomProgress)) * zoom;

  const stitchSrc = requireAsset(stitchImage);

  const ttsSrc = useMemo(() => {
    if (!enableTts) return null;
    return ensureTtsFile({ text: narration, id: `${variant}` });
  }, [enableTts, narration, variant]);

  return (
    <Sequence from={from} durationInFrames={duration}>
      <AbsoluteFill>
        {sfx?.whoosh ? (
          <Audio src={requireAsset(sfx.whoosh)} startFrom={0} volume={0.35} />
        ) : null}

        {ttsSrc ? <Audio src={ttsSrc} startFrom={intro} volume={1.0} /> : null}

        <AbsoluteFill style={{ opacity: 0.92 }}>
          <Img
            src={stitchSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1 + 0.02 * zoomMix})`,
              filter: 'saturate(1.05) contrast(1.05)',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(90deg, rgba(11,12,16,0.88), rgba(11,12,16,0.35))',
            }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            padding: 72,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pill text={label} tone={variant === 'short' ? 'cyan' : 'violet'} />
            <Pill text="LetMeFind" tone="neutral" />
          </div>

          <Title text={title} subtext={variant === 'short' ? 'Kısa Prompt Demo' : 'Uzun Prompt Demo'} appearFrame={intro} />

          <div
            style={{
              marginTop: 12,
              maxWidth: 980,
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              padding: 24,
              transformOrigin: 'left top',
              transform: `scale(${1 + 0.25 * zoomMix}) translateY(${-(18 * zoomMix)}px)`,
              boxShadow:
                zoomMix > 0.2 ? '0 30px 80px rgba(0,0,0,0.35)' : 'none',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Caption label="PROMPT" text={prompt} emphasize />
          </div>

          <div style={{ marginTop: 'auto', maxWidth: 1180 }}>
            <Caption label="TÜRKÇE AÇIKLAMA" text={narration} />
          </div>

          {localFrame > outroStart ? (
            <div style={{ marginTop: 10 }}>
              <Pill text={cta} tone={variant === 'short' ? 'neutral' : 'cyan'} />
            </div>
          ) : null}
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};

function requireAsset(file: string): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`../../assets/${file}`);
}
