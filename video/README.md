# LetMeFind Video Ads (Remotion)

This folder contains a Remotion project that renders a **60s YouTube (16:9)** animated **product demo** video for LetMeFind.

## Install Remotion Agent Skills (recommended)
If you are using Claude Code (or another coding agent that supports `skills`), add the official Remotion Agent Skills:

```bash
cd video
npx skills add remotion-dev/skills
```

> If your agent does not support `skills`, you can still use the project normally.

## System prompt (for coding agents)
Use this as a **system prompt** to keep the agent aligned when editing Remotion code.

```text
You are an expert Remotion developer and motion designer.
Goal: Implement a 60s YouTube (16:9) product demo ad video for LetMeFind.

Hard constraints:
- 1920x1080, 30fps, total 60 seconds.
- One single composition / one single MP4 output.
- Deterministic render: no randomness, no Date.now(), no non-deterministic layout.
- Use <Sequence> for timeline/layering. Keep each scene encapsulated.
- Use interpolate() for smooth transitions and cursor motion.
- Use spring() for premium physics-based micro-interactions (button press, bounce, ripple feel).
- Use <Audio>/<Video> for media sync. Background music across whole video.
- Implement audio ducking: when TTS narration plays, lower music volume; restore afterward.

Scene plan (timeline):
- 0–3s: Intro (logo/slogan)
- 3–8s: Prompt/Sign-up scene (prompt box with typing feel)
- 8–25s: Cursor moves to Send button and clicks (sync click SFX exactly on click frame)
- 25–42s: Results scene using stitch screenshot + highlight tags
- 42–55s: Feature cards carousel (4 cards)
- 55–60s: Outro + CTA

Copy rules:
- On-screen “prompt” must sound like a real student DM, not marketing.
- Constraints: ~3000 TL budget, ANC, light/comfortable, mic ok for online classes.
- Ask for 3 options + pros/cons + quick recommendation.
- No specific brand/model names.

Assets:
- Use video/assets/music.mp3 as the only background music.
- Use video/assets/short_stitch.png as the results stitch screenshot.
- Optional: video/assets/click.mp3 for click SFX.

Deliverables:
- Keep code readable and modular.
- Provide a single render command in package.json.
```

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
