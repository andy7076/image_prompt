# PROMPT/SIGNAL

> A curated visual index for GPT image prompts.

PROMPT/SIGNAL turns high-signal GPT image examples into a searchable, filterable gallery. Browse the masonry feed, inspect the original prompt, copy it, attach a reference image, and generate a new result with any OpenAI-compatible image endpoint.

## Highlights

- Masonry gallery with progressive loading and image placeholders
- Full-text search, category filters, sorting, and persistent favorites
- Detail view with editable prompts, copy, source links, and keyboard navigation
- Multiple source links per case, including multiple links from the same platform
- Optional browser-local image engine configuration and direct generation
- Responsive layout for desktop and mobile

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production bundle:

```bash
npm run build
npm run preview
```

## Image Engine

Open the settings icon in the header and enter an OpenAI-compatible endpoint, API key, and model name. `Size` and `Quality` default to `auto`.

Use the provider's OpenAI-compatible Images API endpoint:

```text
API URL: https://your-provider.example/v1/images/generations
API KEY: your API key
MODEL: the exact model name enabled by the provider
```

The key is stored only in the current browser's local storage and is sent directly to the configured endpoint when you generate. With a local reference image, the app switches to the endpoint's `/edits` route and submits a multipart request. The endpoint must allow browser CORS requests.

## Data

The gallery combines curated local entries with the public `awesome-gpt-image-2` dataset and selected X community examples. Remote GitHub and X media are lazy-loaded to keep the repository lightweight. Each case can define one or more source links:

```js
sources: [
  { label: 'X', url: 'https://x.com/...' },
  { label: 'GitHub', url: 'https://github.com/...' },
]
```

Original creators and platforms retain their respective rights. Verify attribution and licensing before commercial use.

## Project Layout

```text
src/App.jsx                 UI and interaction flows
src/styles.css              visual system and responsive layout
src/data.js                 featured entries and dataset composition
src/cases.generated.json    normalized GitHub cases
src/zhidawang.generated.json
                            selected X cases
public/images/              curated local assets
```

## Sources

- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
- [wuyoscar/GPT-Image2-Skill](https://github.com/wuyoscar/GPT-Image2-Skill)
- [andy7076/image_prompt](https://github.com/andy7076/image_prompt)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## GitHub Pages

Pushes to `main` are deployed automatically through [GitHub Actions](.github/workflows/deploy-pages.yml).

1. In the repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. After the workflow completes, open [andy7076.github.io/image_prompt](https://andy7076.github.io/image_prompt/).
