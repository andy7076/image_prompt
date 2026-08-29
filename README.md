# PROMPT/SIGNAL

> A curated, editable archive of 570+ image prompts with a browser-native generation studio.

<p align="center">
  <a href="https://andy7076.github.io/image_prompt/">Live demo</a>
  ·
  <a href="https://linux.do">LINUX DO community</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/blob/main/README.zh-CN.md">简体中文</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/issues">Issues</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/andy7076/image_prompt?style=flat-square&color=b7c900&labelColor=171713" alt="GitHub stars" />
  <img src="https://img.shields.io/github/deployments/andy7076/image_prompt/github-pages?style=flat-square&label=pages&color=4ade80&labelColor=171713" alt="GitHub Pages deployment" />
  <img src="https://img.shields.io/badge/license-MIT-b7c900?style=flat-square&labelColor=171713" alt="MIT License" />
  <img src="https://img.shields.io/badge/React-Vite-171713?style=flat-square&logo=react&logoColor=61dafb" alt="React and Vite" />
</p>

![PROMPT/SIGNAL gallery](./public/images/readme-home-wide.png)

PROMPT/SIGNAL turns high-signal image prompt references from public communities into a practical workspace. Discover a case, edit its prompt and variables, hand it off to ChatGPT or Gemini, or generate through an image model configured in your own browser.

## Product surface

| Surface | What it does |
| --- | --- |
| Curated gallery | 570+ cases in a balanced masonry layout with search, categories, sorting, favorites, and stable loading states. |
| Prompt workspace | Full-text editing, extracted variables, restore-original, multiple source links, image zoom, and multi-image case navigation. |
| External handoff | Open short prompts directly in ChatGPT, or copy the current edited prompt before opening ChatGPT or Gemini in a new tab. |
| Generation studio | Start from a case or a blank prompt, attach up to eight references, select a model, override output settings, and confirm before sending. |
| Model profiles | Save multiple Images API or GenerateContent API connections locally and switch the active profile per generation. |
| Local archive | Favorites, theme/language preferences, model profiles, and up to 30 generated results stay in the current browser. |

## Screenshots

<table>
  <tr>
    <td><img src="./public/images/readme-detail.png" alt="Prompt detail workspace" /></td>
    <td><img src="./public/images/readme-settings.png" alt="Image model settings" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Edit a case and its reusable variables</sub></td>
    <td align="center"><sub>Save and switch local model profiles</sub></td>
  </tr>
  <tr>
    <td><img src="./public/images/readme-generate-confirm.png" alt="Generation confirmation" /></td>
    <td><img src="./public/images/readme-home.png" alt="Gallery home" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Review the final prompt and references</sub></td>
    <td align="center"><sub>Browse the full prompt archive</sub></td>
  </tr>
</table>

## Featured cases

Start with the references that best show the range of the archive. Each card opens the editable case in the live gallery.

<table>
  <tr>
    <td width="20%"><a href="https://andy7076.github.io/image_prompt/?prompt=x-zhidawang-travel-memory"><img src="https://mosaic.fxtwitter.com/jpeg/2092165086165246217/HQjc9OQbcAAWg_e/HQjc9OMb0AAo_3O" alt="Travel memory enamel magnet" /></a></td>
    <td width="20%"><a href="https://andy7076.github.io/image_prompt/?prompt=x-zhidawang-lego-storybook"><img src="https://mosaic.fxtwitter.com/jpeg/2092062124730384570/HQh-bHBaAAAbKiZ/HQh_Xe4bIAAcQa9" alt="Fairytale LEGO storybook" /></a></td>
    <td width="20%"><a href="https://andy7076.github.io/image_prompt/?prompt=x-hot-ciri-stamp-macro"><img src="https://pbs.twimg.com/media/HKQ_LMwbQAArrZh.jpg?name=orig" alt="Vintage stamp macro" /></a></td>
    <td width="20%"><a href="https://andy7076.github.io/image_prompt/?prompt=case-30"><img src="https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case30.jpg" alt="Realistic photography study" /></a></td>
    <td width="20%"><a href="https://andy7076.github.io/image_prompt/?prompt=case-32"><img src="https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case32.jpg" alt="Illustration art study" /></a></td>
  </tr>
  <tr>
    <td align="center"><sub>Travel memory</sub></td>
    <td align="center"><sub>LEGO storybook</sub></td>
    <td align="center"><sub>Stamp macro</sub></td>
    <td align="center"><sub>Photography</sub></td>
    <td align="center"><sub>Illustration</sub></td>
  </tr>
</table>

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Before opening a pull request, run:

```bash
npm run check              # validate catalog data and build
npm run build              # production build
npm run preview            # preview the production build
npm run extract:dimensions # refresh local image dimensions
```

## Configure an image model

Open **Models** in the header, add or select a profile, then save it. The form is provider-neutral: enter the protocol, URL, key, and exact model identifier your endpoint documents. New visitors start with empty URL, key, and model fields; `SIZE` and `QUALITY` default to `auto`.

| Field | Value |
| --- | --- |
| `API PROTOCOL` | `Images API` for OpenAI-compatible image routes, or `GenerateContent API` for Gemini-style routes. |
| `API URL` | The full image route, or the GenerateContent base URL. |
| `API KEY` | The token required by that endpoint. It is stored only in this browser. |
| `MODEL` | The exact model name accepted by the endpoint. |
| `SIZE` | `auto`, `1024x1024`, `1536x1024`, `1024x1536`, `1792x1024`, or `1024x1792`. |
| `QUALITY` | `auto`, `low`, `medium`, `high`, `standard`, or `hd` for Images API profiles. |

Profile `SIZE` and `QUALITY` values are defaults. The generation screen lets you override them for the current request without changing the saved profile.

The **Test connection** action sends a validation-only request. It never asks the model to create an image. A 400/415/422 response is treated as a reachable endpoint with a rejected validation payload; only clear 401/403 authentication failures or 404 route/model failures are reported as errors. Network, CORS, rate-limit, and server-validation cases remain warnings so a usable gateway is not incorrectly blocked.

### Browser and gateway requirements

Requests are sent directly from the browser, so the endpoint must allow CORS for the site origin. Images API requests use `Authorization: Bearer <key>`; GenerateContent requests use `x-goog-api-key`.

For an Images API endpoint, the text-only request is:

```http
POST /v1/images/generations
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```json
{
  "model": "your-model",
  "prompt": "Your edited prompt",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1
}
```

When reference images are attached, the app losslessly optimizes each file in the browser, changes a trailing `/generations` route to `/edits`, and sends `multipart/form-data`. One file uses `image`; multiple files use `image[]`. The response must expose `data[0].url` or `data[0].b64_json`.

For a GenerateContent endpoint, use the base URL and model name separately. The app builds `/models/{model}:generateContent`, sends the prompt and reference images as content parts, and reads inline image data from the response.

> Never commit a production API key. Local browser storage is convenient for personal use; use a server-side proxy when deploying for multiple users.

## Use a prompt

### Continue in ChatGPT or Gemini

1. Open a case and edit its prompt or template variables.
2. Select the ChatGPT or Gemini icon beside **Generate with model**.
3. Review the handoff notice, then confirm.
4. Short ChatGPT prompts are included in the destination URL. Long prompts and Gemini handoffs are copied first, then the platform opens in a new tab for manual paste.

Clipboard-based handoff may trigger a browser permission request. The app reports a failed copy instead of silently reusing stale clipboard content.

### Generate with a configured model

1. Open a case, or choose **Create image** to start with a completely custom prompt.
2. Edit the prompt and attach up to eight PNG, JPEG, or WEBP reference images.
3. Select a saved model profile and choose `SIZE` and `QUALITY` for this request.
4. Click **Generate with model**, review the confirmation, then generate.
5. Reopen the result from **Generation history** to copy its prompt, download the image, or create another variation.

Reference images are processed locally and losslessly optimized before upload. Generated downloads open in a new tab when the browser cannot download the remote URL directly.

## Local data and privacy

- Model profiles, API keys, favorites, preferences, and generation history are stored in the current browser only.
- Prompt and reference-image requests go directly from the browser to the selected endpoint; this repository does not provide a relay server.
- ChatGPT/Gemini handoff always shows a confirmation step before opening an external platform.
- Clearing browser storage removes local configuration and history. Do not use a production key on a shared device.

The header switches between English and Chinese, and between light and dark themes. The default theme is light.

## Data and attribution

The catalog is curated from:

- [`freestylefly/awesome-gpt-image-2`](https://github.com/freestylefly/awesome-gpt-image-2)
- [`wuyoscar/GPT-Image2-Skill`](https://github.com/wuyoscar/GPT-Image2-Skill)
- Public X posts and creator references

Each case keeps its public source URL(s), attribution, and normalized prompt text. Prompt wording, images, trademarks, and creator names remain subject to their original owners and licenses. Check permissions before commercial use. Corrections and additional sources are welcome through an issue or pull request.

## Repository map

```text
src/App.jsx                 UI, i18n, theme, profiles, and generation flow
src/styles.css              Visual system, responsive layout, and motion
src/data.js                 Categories, featured cases, and normalization
src/*.generated.json        Curated prompt records and source metadata
public/images/              Gallery assets and README screenshots
scripts/                    Catalog validation and dimension tooling
.github/workflows/          GitHub Pages deployment
```

## Deploy to GitHub Pages

Pushes to `main` trigger [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml). The public build is available at [andy7076.github.io/image_prompt](https://andy7076.github.io/image_prompt/).

## Contributing

Include the original public URL, attribution details, and a short explanation for every data change. Keep generated records deterministic and run `npm run check` before submitting a pull request.

## License

The application code is released under the [MIT License](./LICENSE). Third-party images, prompt text, trademarks, and creator references follow their respective rights and licenses.

<p align="center"><sub>Open prompts. Real references. A faster path from idea to image.</sub></p>
