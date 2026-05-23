import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const copyPath = path.resolve(__dirname, '..', 'src', 'copy.json');
const publicDir = path.resolve(__dirname, '..', 'public');
const outDir = path.join(publicDir, 'tts');

const enable = process.env.ENABLE_TTS !== '0';
if (!enable) {
  console.log('TTS generation is disabled via ENABLE_TTS=0');
  process.exit(0);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY not set. Skipping TTS generation.');
  process.exit(0);
}

const modelName = 'gemini-3.1-flash-tts-preview'; // Hardcode correct model for audio

async function generateTts(text, id) {
  const outFile = path.join(outDir, `${id}.mp3`);
  if (fs.existsSync(outFile)) {
    console.log(`TTS for ${id} already exists. Skipping.`);
    return;
  }

  console.log(`Generating TTS for ${id}...`);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Provide Gemini native audio options
  const voiceName = process.env.GEMINI_TTS_VOICE && !process.env.GEMINI_TTS_VOICE.includes('tr-TR')
    ? process.env.GEMINI_TTS_VOICE
    : 'Aoede';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName
            }
          }
        }
      }
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

  fs.mkdirSync(outDir, { recursive: true });

  if (!base64Audio) {
    console.error(`No audio data returned from Gemini TTS for ${id}`);
    fs.writeFileSync(outFile, Buffer.from([]));
    return;
  }

  fs.writeFileSync(outFile, Buffer.from(base64Audio, 'base64'));
  console.log(`Wrote TTS for ${id} to ${outFile}`);
}

async function main() {
  if (!fs.existsSync(copyPath)) {
    console.error(`copy.json not found at ${copyPath}`);
    process.exit(1);
  }

  const copyData = JSON.parse(fs.readFileSync(copyPath, 'utf8'));

  if (copyData.short && copyData.short.narration) {
    await generateTts(copyData.short.narration, 'short');
  }

  if (copyData.long && copyData.long.narration) {
    await generateTts(copyData.long.narration, 'long');
  }
}

main().catch(err => {
  console.error('TTS Generation Error:', err);
  process.exit(1);
});
