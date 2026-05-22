import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates and caches TTS mp3 under video/assets/tts/<id>.mp3
 *
 * Requirements:
 * - GOOGLE_APPLICATION_CREDENTIALS must point to a service account JSON
 * - ENABLE_TTS != 0
 */
export function ensureTtsFile({ text, id }: { text: string; id: string }): string {
  const enable = process.env.ENABLE_TTS !== '0';
  const assetsDir = path.resolve(process.cwd(), 'assets');
  const outDir = path.join(assetsDir, 'tts');
  const outFile = path.join(outDir, `${id}.mp3`);

  if (!enable) return outFile;
  if (fs.existsSync(outFile)) return outFile;

  fs.mkdirSync(outDir, { recursive: true });

  // Generate TTS in a separate Node process so render can block deterministically.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { execFileSync } = require('node:child_process');

  const voiceName = process.env.GOOGLE_TTS_VOICE || 'tr-TR-Wavenet-C';

  const script = `
    const fs = require('node:fs');
    const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
    (async () => {
      const client = new TextToSpeechClient();
      const [response] = await client.synthesizeSpeech({
        input: { text: ${JSON.stringify(text)} },
        voice: { languageCode: 'tr-TR', name: ${JSON.stringify(voiceName)} },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.02, pitch: 0 },
      });
      fs.mkdirSync(${JSON.stringify(outDir)}, { recursive: true });
      fs.writeFileSync(${JSON.stringify(outFile)}, response.audioContent, 'binary');
    })().catch((e) => {
      console.error('TTS error:', e);
      fs.mkdirSync(${JSON.stringify(outDir)}, { recursive: true });
      fs.writeFileSync(${JSON.stringify(outFile)}, Buffer.from([]));
    });
  `;

  execFileSync(process.execPath, ['-e', script], { stdio: 'inherit', env: process.env });

  return outFile;
}
