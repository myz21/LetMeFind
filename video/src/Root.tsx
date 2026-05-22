import React from 'react';
import { Composition } from 'remotion';
import { LetMeFindDemo } from './scenes/LetMeFindDemo';
import { copy } from './copy';

// 60s @ 30fps = 1800 frames
const FPS = 30;
const DURATION_IN_FRAMES = 60 * FPS;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="LetMeFindDemo"
        component={LetMeFindDemo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          copy,
          music: {
            file: 'music.mp3',
            volume: 0.18,
          },
          assets: {
            stitch: 'short_stitch.png',
          },
          enableTts: true,
        }}
      />
    </>
  );
};
