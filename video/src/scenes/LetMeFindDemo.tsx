import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { VideoCopy } from '../copy';
import { IntroScene } from './demo/IntroScene';
import { PromptScene } from './demo/PromptScene';
import { ResultsScene } from './demo/ResultsScene';
import { FeaturesScene } from './demo/FeaturesScene';
import { OutroScene } from './demo/OutroScene';

export type LetMeFindDemoProps = {
  copy: VideoCopy;
  music: { file: string; volume: number };
  assets: { stitch: string };
  enableTts: boolean;
};

export const LetMeFindDemo: React.FC<LetMeFindDemoProps> = (props) => {
  const frame = useCurrentFrame(<);
  const { fps, durationInFrames } = useVideoConfig();

  // Single background music across the whole video
  const musicVol = interpolate(
    frame,
    [0, fps * 1.0, durationInFrames - fps * 1.5, durationInFrames],
    [0, props.music.volume, props.music.volume, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const s0 = 0;
  const dIntro = 5 * fps;
  const dPrompt = 15 * fps;
  const dResults = 20 * fps;
  const dFeatures = 15 * fps;
  const dOutro = durationInFrames - (dIntro + dPrompt + dResults + dFeatures);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0c10' }}>
      <Sequence from={s0} durationInFrames={dIntro}>
        <IntroScene />
      </Sequence>

      <Sequence from={s0 + dIntro} durationInFrames={dPrompt}>
        <PromptScene
          enableTts={props.enableTts}
          // Use the long prompt copy as the main demo prompt
          prompt={props.copy.long.prompt}
          narration={props.copy.long.narration}
        />
      </Sequence>

      <Sequence from={s0 + dIntro + dPrompt} durationInFrames={dResults}>
        <ResultsScene stitchImage={props.assets.stitch} />
      </Sequence>

      <Sequence from={s0 + dIntro + dPrompt + dResults} durationInFrames={dFeatures}>
        <FeaturesScene
          features={[
            { title: 'Filtrele', text: 'Bütçe, ANC, ağırlık ve kullanım senaryosuna göre daralt.' },
            { title: 'Karşılaştır', text: 'Seçenekleri yan yana koy, farkı anında gör.' },
            { title: 'Özetle', text: 'Artı/eksi ve kısa karar önerisi.' },
            { title: 'Hızlı Link', text: 'Kaynağa tek tıkla git, detayları kontrol et.' },
          ]}
        />
      </Sequence>

      <Sequence from={s0 + dIntro + dPrompt + dResults + dFeatures} durationInFrames={dOutro}>
        <OutroScene cta={props.copy.long.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
