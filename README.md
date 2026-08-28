# PROMPT/SIGNAL

> A focused gallery for discovering, editing, and rendering high-signal image prompts.

<p align="center">
  <a href="https://andy7076.github.io/image_prompt/">Live demo</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/blob/main/README.zh-CN.md">简体中文</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/issues">Issues</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/andy7076/image_prompt?style=flat-square&color=eaff32&labelColor=111111" alt="GitHub stars" />
  <img src="https://img.shields.io/github/deployments/andy7076/image_prompt/github-pages?style=flat-square&label=pages&color=4ade80&labelColor=111111" alt="GitHub Pages deployment" />
  <img src="https://img.shields.io/badge/license-MIT-eaff32?style=flat-square&labelColor=111111" alt="MIT License" />
  <img src="https://img.shields.io/badge/React-Vite-111111?style=flat-square&logo=react&logoColor=61dafb" alt="React and Vite" />
</p>

![PROMPT/SIGNAL gallery](./public/images/prompt-signal-home.jpg)

PROMPT/SIGNAL turns public image-prompt references into a searchable masonry workspace. Browse a case, inspect its full prompt, edit it, attach a local reference image, and send the request to an image endpoint you control. The interface starts in English and can be switched to Chinese from the header.

## What ships

- **Physical masonry engine** — exact image dimensions (`width` / `height`) pre-calculated for zero layout shift (CLS = 0), uncropped natural ratios, and greedy shortest-column distribution for mathematically balanced column heights (<0.5% variance).
- **Custom image creation** — dedicated top-level "Create image" studio supporting custom prompt generation and multiple reference photo uploads.
- **Multi-profile engine settings** — save, name, and switch between multiple provider profiles (e.g. Google AI Studio, SiliconFlow, OpenAI-compatible gateways) with fast inline switching in the detail panel.
- **Prompt workspace** — full prompt editing, interactive template variable inputs, copy-to-clipboard, multi-source links, previous/next navigation, and image zoom.
- **Generation flow** — editable confirmation dialog, optional PNG/JPEG/WEBP reference images, generated/source switching, and download in a new tab.
- **Local archive** — favorites, multi-profile configurations, language preference, and up to 30 generated results persist in the current browser only.
- **Multi-source attribution** — a case can retain multiple source URLs across GitHub, X, and other public references.
- **Static-first deployment** — no backend is required for browsing; GitHub Actions builds and deploys the site to Pages.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Useful scripts:

```bash
npm run build              # Production build
npm run preview            # Preview production build
npm run check              # Validate data integrity and compile
npm run extract:dimensions # Concurrently detect and update image dimensions
```

## Connect an image provider

Open **Image model settings** in the top-right corner. Configure and save multiple provider profiles; enter the exact URL, key, and model identifier supplied by your gateway or image service:

| Field | What to enter | Example |
| --- | --- | --- |
| `API PROTOCOL` | Request/response format implemented by the endpoint | `Images API` / `GenerateContent API` |
| `API URL` | Complete endpoint or GenerateContent API base URL | `https://gateway.example/v1/images/generations` |
| `API KEY` | Bearer token issued by your service or Google API Key | `sk-...` / `AIzaSy...` |
| `MODEL` | The exact model name accepted by the endpoint | `gpt-image-2` / `gemini-3.1-flash-image` |
| `SIZE` | Output size (`auto (1024x1024)`, `1:1`, `3:2`, `2:3`, `16:9`, `9:16`) | `1024x1024` |
| `QUALITY` | Output quality (`auto`, `standard`, `hd`) | `auto` |

### Gateway and proxy rules

PROMPT/SIGNAL sends requests directly from the browser. Your endpoint therefore needs browser CORS permission for the site origin. **Images API** uses `Authorization: Bearer <key>`; **GenerateContent API** uses `x-goog-api-key`.

- If your service gives you a base URL, append its image route, usually `/v1/images/generations`.
- When reference images are attached, the app derives the edit route by replacing the trailing `/generations` with `/edits`. One image uses `image`; multiple images use `image[]`.
- `auto` size automatically resolves to `1024x1024` for third-party gateways with helpful error diagnostics.
- Never commit a production key. Settings are stored in `localStorage` and are never bundled into the repository, but a browser can still access the key while you use the page.

The text-only request is equivalent to:

```http
POST /v1/images/generations
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```json
{
  "model": "gpt-image-2",
  "prompt": "Your edited prompt",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1
}
```

For reference images, the app submits `multipart/form-data` with image files plus `model`, `prompt`, `size`, `quality`, and `n`. The response should expose either `data[0].url` or `data[0].b64_json`.

### Gemini image models

A Gemini app subscription does not automatically include Gemini API quota. Create an API key in Google AI Studio and enable billing there if your selected model requires it. Use:

| Field | Value |
| --- | --- |
| `API PROTOCOL` | `GenerateContent API` |
| `API URL` | `https://generativelanguage.googleapis.com/v1beta` |
| `API KEY` | Your Google AI Studio API key |
| `MODEL` | `gemini-3.1-flash-image` for Nano Banana 2, or `gemini-3-pro-image` for Nano Banana Pro |
| `SIZE` / `QUALITY` | `auto` / `auto` |

The app appends `/models/{model}:generateContent`, sends every attached reference as an inline image part, and reads the generated image from the response. Keep the key local; for a shared production deployment, place a server-side proxy in front of the API.

`gemini-2.5-flash-image` remains available as the original Nano Banana model, but Google currently recommends the newer Gemini 3 image models for new integrations.

## Use the workspace

1. Search or filter the gallery to find a reference (or click "Create image" in the header to start from scratch).
2. Open a case and edit the prompt directly or modify extracted template parameters.
3. Optionally upload up to eight local reference images, then review the prompt and every reference in the confirmation dialog.
4. Confirm generation. The result is recorded in **Generation history**.
5. Reopen a previous result from the history panel to copy its prompt, download the image, or render another variation.

The language switch is in the header. English is the default for new visitors; the preference is remembered locally.

## Data and attribution

The gallery combines curated material from:

- [`freestylefly/awesome-gpt-image-2`](https://github.com/freestylefly/awesome-gpt-image-2)
- [`wuyoscar/GPT-Image2-Skill`](https://github.com/wuyoscar/GPT-Image2-Skill)
- Public X posts and creator references

The additional X set stores the public post URL and an engagement snapshot captured at collection time; engagement numbers are context, not an endorsement or a ranking guarantee.

Prompt text, images, names, and trademarks remain subject to their original authors and licenses. Check the source and obtain permission before commercial use. Corrections and additional source URLs are welcome through an issue or pull request.

## Project structure

```text
src/App.jsx                 React UI, i18n, interactions, and generation flow
src/styles.css              Design system, responsive layout, and motion
src/data.js                 Curated cases, categories, and source metadata
src/cases.generated.json    GitHub-derived prompt records (with exact dimensions)
src/zhidawang.generated.json X-derived prompt records (with exact dimensions)
src/x.hot.generated.json    Additional high-engagement X prompt records (with exact dimensions)
scripts/                    Validation and dimension extraction scripts
public/images/              Gallery assets and README screenshots
.github/workflows/          GitHub Pages deployment
```

## GitHub Pages

Pushes to `main` trigger [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml). The public build is available at:

**[andy7076.github.io/image_prompt](https://andy7076.github.io/image_prompt/)**

## Contributing

Please include the original public URL, attribution details, and a short explanation of any prompt or metadata change. Keep generated data deterministic and run `npm run check` before opening a pull request.

## License

This project is open-sourced under the [MIT License](./LICENSE).

Third-party materials, curated images, prompt texts, trademarks, and creator handles remain the intellectual property and copyright of their respective authors and platforms.

<p align="center"><sub>Built for people who collect references, not just likes.</sub></p>
