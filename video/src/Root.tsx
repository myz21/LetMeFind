import React from 'react';
import { Composition } from 'remotion';
import { LetMeFindAB } from './scenes/LetMeFindAB';

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
            label: 'Kısa Prompt',
            prompt: 'Öğrenci bütçesine uygun, ANC’li ve hafif bir kulaklık öner. 3 seçenek yaz.',
            narration:
              'Kısa prompt ile hızlıca 3 seçenek çıkarıyoruz. Önceliğimiz: aktif gürültü engelleme, hafiflik ve bütçe.',
            stitchImage: 'short_stitch.png',
          },
          long: {
            label: 'Uzun Prompt',
            prompt:
              'Ben üniversite öğrencisiyim. Kütüphanede ders çalışırken dış sesleri kesmek için ANC özellikli, uzun süre takınca rahatsız etmeyen hafif bir kulaklık arıyorum. Bütçem 3.000 TL civarı. Online dersler için mikrofonu da idare etsin. 3 seçenek öner ve en iyi seçimi 2–3 cümleyle gerekçelendir.',
            narration:
              'Uzun prompt ile kullanım senaryosunu netleştiriyoruz: kütüphane odağı, ANC, hafiflik, 3.000 TL bütçe ve online dersler için mikrofon.',
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
