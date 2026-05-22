import fs from 'node:fs';
import path from 'node:path';

const outPath = path.resolve(process.cwd(), 'src', 'copy.json');

const model = process.env.GEMINI_TEXT_MODEL || 'gemini-3.5-flash';
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Set it in video/.env (or your shell) before running.');
  process.exit(1);
}

const prompt = `You are a Turkish advertising copywriter for a student audience.
We are making a 60s YouTube video split into two 30s segments:
- Segment A: Kısa Prompt
- Segment B: Uzun Prompt

Topic: ANC destekli, hafif, öğrenci bütçesine uygun kulaklık önerisi.

Return ONLY valid JSON with this exact schema:
{
  "short": {
    "label": "Kısa Prompt",
    "prompt": "...",
    "narration": "...",
    "title": "...",
    "cta": "..."
  },
  "long": {
    "label": "Uzun Prompt",
    "prompt": "...",
    "narration": "...",
    "title": "...",
    "cta": "..."
  }
}

Rules:
- Turkish only.
- Prompts must sound like real user prompts.
- Narration should be 1-2 sentences suitable for TTS.
- Titles should be short and energetic.
- CTA should be a short question at the end.
- Avoid brand names that you cannot verify. Do NOT mention specific models.
`;

async function generate() {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini generateContent failed: ${res.status} ${t}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')?.trim();
  if (!text) throw new Error('Empty response from Gemini');
  console.log("Raw response:", text);

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    const match = text.match(/```json([\s\S]*?)```/i);
    if (match) {
      json = JSON.parse(match[1].trim());
    } else {
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      json = JSON.parse(cleaned);
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
