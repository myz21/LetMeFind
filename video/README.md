# LetMeFind Video Ads (Remotion)

This folder contains a Remotion project that renders a **60s YouTube (16:9)** animated **product demo** video for LetMeFind.

## Optional: Install Remotion Agent Skills
If you are using Claude Code (or another coding agent), you can add the official Remotion Agent Skills to help the agent write stable Remotion code:

```bash
cd video
npx skills add https://github.com/remotion-dev/skills --skill remotion
```

> This is optional. The project works without it.

## What it renders
- Total: **60 seconds**
- One video, multiple scenes:
  1) Intro
  2) Prompt + zoom
  3) Results (stitch)
  4) Feature highlights
  5) Outro

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

- `video/assets/short_stitch.png` (used as the results stitch)
- `video/assets/music.mp3` (single background music)

### 2) Configure env
In `video/.env`:
- `GEMINI_API_KEY=...` (required for copy generation)
- `ENABLE_TTS=1` (set 0 to disable TTS)

For Google TTS auth (ONLY needed if ENABLE_TTS=1):

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```

### 3) Render (one command)

```bash
npm run render:demo
```

This will:
1) Generate Turkish ad copy with Gemini (writes `video/src/copy.json`)
2) Render the MP4 with Remotion

Output:
- `video/out/letmefind_demo_youtube.mp4`

## Notes
- TTS output is cached in `video/assets/tts/demo_prompt.mp3`.
- If you only want Gemini copy (no voice): set `ENABLE_TTS=0`.
