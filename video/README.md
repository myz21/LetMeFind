# LetMeFind Video Ads (Remotion)

This folder contains a Remotion project that renders a **60s YouTube (16:9)** ad-style demo video showing **Short Prompt vs Long Prompt** A/B.

## Optional: Install Remotion Agent Skills
If you are using Claude Code (or another coding agent), you can add the official Remotion Agent Skills to help the agent write stable Remotion code:

```bash
cd video
npx skills add remotion-dev/skills
```

> This is optional. The project works without it.

## What it renders
- Total: **60 seconds**
- Segment A (0-30s): **Kısa Prompt**
- Segment B (30-60s): **Uzun Prompt**
- Includes:
  - Product "stitch" images you will provide
  - Background music
  - Optional SFX (whoosh/click)
  - Turkish on-screen captions
  - Turkish TTS voiceover via **Google Cloud Text-to-Speech**

## Prereqs
- Node.js 20+
- ffmpeg installed (Remotion requires it for rendering)

## Setup

```bash
cd video
npm install
cp .env.example .env
```

### Add your assets
Put your assets here:

- `video/assets/short_stitch.png`  (your stitched screenshot for Short Prompt)
- `video/assets/long_stitch.png`   (your stitched screenshot for Long Prompt)
- `video/assets/music.mp3`         (background music)
- Optional:
  - `video/assets/whoosh.mp3`
  - `video/assets/click.mp3`

### Google TTS
Create a Google Cloud service account JSON and set:

- `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json`

Optionally override voice:
- `GOOGLE_TTS_VOICE=tr-TR-Wavenet-C`

## Render

```bash
# From repo root
npm run video:install
npm run video:render:ab
```

Output:
- `video/out/letmefind_ab_youtube.mp4`

## Notes
- The TTS is generated and cached into `video/assets/tts/` on first render.
- If you don't want TTS, set `ENABLE_TTS=0` in `video/.env`.
