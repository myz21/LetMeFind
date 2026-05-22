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
- Uses stitched frontend screenshots you provide:
  - `video/assets/short_stitch.png`
  - `video/assets/long_stitch.png`

## Prereqs
- Node.js 20+
- ffmpeg installed

## Setup

```bash
cd video
npm install
cp .env.example .env
```

### 1) Add your assets
Put your assets here:

- `video/assets/short_stitch.png`
- `video/assets/long_stitch.png`
- `video/assets/music.mp3`

Optional:
- `video/assets/whoosh.mp3`
- `video/assets/click.mp3`

### 2) Configure env
In `video/.env`:
- `GEMINI_API_KEY=...` (required for copy generation)
- `ENABLE_TTS=1`

For Google TTS auth (recommended in your shell):

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```

### 3) Generate Turkish ad copy with Gemini

```bash
npm run copy:generate
```

This writes `video/src/copy.json`.

### 4) Render

```bash
npm run remotion:render:ab
```

Output:
- `video/out/letmefind_ab_youtube.mp4`

## Notes
- TTS output is cached in `video/assets/tts/short.mp3` and `video/assets/tts/long.mp3`.
- If you don't want TTS: set `ENABLE_TTS=0`.
