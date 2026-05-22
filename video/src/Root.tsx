import React from 'react';
import { Composition } from 'remotion';
import { LetMeFindAB } from './scenes/LetMeFindAB';
import { copy } from './copy';

// 60s @ 30fps = 1800 frames
const FPS = 30;
const DURATION_IN_FRAMES = 60 * FPS;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="LetMeFindAB"
        component={LetMeFindAB}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          short: {
            label: copy.short.label,
            prompt: copy.short.prompt,
            narration: copy.short.narration,
            title: copy.short.title,
            cta: copy.short.cta,
            stitchImage: 'short_stitch.png',
          },
          long: {
            label: copy.long.label,
            prompt: copy.long.prompt,
            narration: copy.long.narration,
            title: copy.long.title,
            cta: copy.long.cta,
            stitchImage: 'long_stitch.png',
          },
          music: {
            file: 'music.mp3',
            volume: 0.18,
          },
          sfx: {
            whoosh: 'whoosh.mp3',
            click: 'click.mp3',
          },
          enableTts: true,
        }}
      />
    </>
  );
};
