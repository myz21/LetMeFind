import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates and caches TTS mp3 under video/assets/tts/<id>.mp3
 *
 * Requirements:
 * - GEMINI_API_KEY must be set
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

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-pro-tts';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set. Skipping TTS generation.');
    return outFile;
  }

  const script = `
    const fs = require('node:fs');
    (async () => {
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' + ${JSON.stringify(modelName)} + ':generateContent?key=' + ${JSON.stringify(apiKey)};
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: ${JSON.stringify(text)} }] }]
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error('Gemini TTS failed: ' + res.status + ' ' + err);
      }
      
      const data = await res.json();
      
      let base64Audio = '';
      const parts = data?.candidates?.[0]?.content?.parts;
      if (parts) {
          for (const p of parts) {
             if (p.inlineData && p.inlineData.data) {
                 base64Audio = p.inlineData.data;
                 break;
             }
          }
      }

      if (!base64Audio) {
        console.error('No audio data returned from Gemini TTS', JSON.stringify(data));
        fs.mkdirSync(${JSON.stringify(outDir)}, { recursive: true });
        fs.writeFileSync(${JSON.stringify(outFile)}, Buffer.from([]));
        return;
      }

      fs.mkdirSync(${JSON.stringify(outDir)}, { recursive: true });
      fs.writeFileSync(${JSON.stringify(outFile)}, Buffer.from(base64Audio, 'base64'));
    })().catch((e) => {
      console.error('TTS error:', e);
      fs.mkdirSync(${JSON.stringify(outDir)}, { recursive: true });
      fs.writeFileSync(${JSON.stringify(outFile)}, Buffer.from([]));
    });
  `;

  execFileSync(process.execPath, ['-e', script], { stdio: 'inherit', env: process.env });

  return outFile;
}
