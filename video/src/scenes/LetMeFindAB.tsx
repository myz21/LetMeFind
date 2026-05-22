import React from 'react';
import { AbsoluteFill, Audio, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { Segment } from './Segment';
import { SafeArea } from '../ui/SafeArea';

const SegmentSchema = z.object({
  label: z.string(),
  prompt: z.string(),
  narration: z.string(),
  title: z.string(),
  cta: z.string(),
  stitchImage: z.string(),
});

export const LetMeFindABPropsSchema = z.object({
  short: SegmentSchema,
  long: SegmentSchema,
  music: z.object({
    file: z.string(),
    volume: z.number().min(0).max(1),
  }),
  sfx: z
    .object({
      whoosh: z.string().optional(),
      click: z.string().optional(),
    })
    .optional(),
  enableTts: z.boolean().default(true),
});

export type LetMeFindABProps = z.infer<typeof LetMeFindABPropsSchema>;

export const LetMeFindAB: React.FC<LetMeFindABProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const half = Math.floor(durationInFrames / 2);

  const musicVol = interpolate(
    frame,
    [0, fps * 1.0, durationInFrames - fps * 1.5, durationInFrames],
    [0, props.music.volume, props.music.volume, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0c10' }}>
      <Audio src={requireAsset(props.music.file)} volume={musicVol} />

      <SafeArea>
        <Segment
          from={0}
          duration={half}
          variant="short"
          label={props.short.label}
          title={props.short.title}
          prompt={props.short.prompt}
          narration={props.short.narration}
          cta={props.short.cta}
          stitchImage={props.short.stitchImage}
          enableTts={props.enableTts}
          sfx={props.sfx}
        />
        <Segment
          from={half}
          duration={durationInFrames - half}
          variant="long"
          label={props.long.label}
          title={props.long.title}
          prompt={props.long.prompt}
          narration={props.long.narration}
          cta={props.long.cta}
          stitchImage={props.long.stitchImage}
          enableTts={props.enableTts}
          sfx={props.sfx}
        />
      </SafeArea>
    </AbsoluteFill>
  );
};

function requireAsset(file: string): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`../assets/${file}`);
}
