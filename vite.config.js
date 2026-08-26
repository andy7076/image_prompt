import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildVersion = process.env.GITHUB_SHA || process.env.GITHUB_RUN_ID || `local-${Date.now()}`

function buildVersionPlugin() {
  return {
    name: 'prompt-signal-build-version',
    transformIndexHtml(html) {
      return html.replace('__PROMPT_SIGNAL_BUILD_VERSION__', buildVersion)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildVersion }),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), buildVersionPlugin()],
  base: process.env.GITHUB_ACTIONS ? '/image_prompt/' : '/',
})
