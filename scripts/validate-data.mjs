import { build } from 'vite'

const REQUIRED_FIELDS = ['id', 'title', 'category', 'image', 'prompt']
const VALID_RATIOS = new Set(['portrait', 'landscape', 'square', 'wide'])
const UNCLEAN_PROMPT_PATTERNS = [
  [/\{argument\s+name=/i, 'argument wrapper'],
  [/(?:^|\n)\s*"(?:prompt|negative_prompt)"\s*:/i, 'JSON prompt wrapper'],
  [/\[(?:中文|English)\]/i, 'bilingual wrapper'],
]

function normalize(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function validHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function itemSources(item) {
  const sources = item.sources ?? item.sourceLinks ?? item.source
  if (Array.isArray(sources)) return sources.map((source) => typeof source === 'string' ? { url: source } : source)
  return sources ? [{ url: sources }] : []
}

function duplicateGroups(items, field) {
  const groups = new Map()
  for (const item of items) {
    const key = normalize(item[field])
    if (!key) continue
    const group = groups.get(key) || []
    group.push(item)
    groups.set(key, group)
  }
  return [...groups.values()].filter((group) => group.length > 1)
}

function printDuplicateWarning(label, groups) {
  if (!groups.length) return
  console.warn(`WARN  ${groups.length} duplicate ${label} group(s)`)
  for (const group of groups.slice(0, 8)) {
    console.warn(`      ${group[0].title} -> ${group.map((item) => item.id).join(', ')}`)
  }
  if (groups.length > 8) console.warn(`      ...and ${groups.length - 8} more group(s)`)
}

const buildResult = await build({
  logLevel: 'silent',
  build: {
    write: false,
    ssr: 'src/data.js',
    rolldownOptions: { output: { codeSplitting: false } },
  },
})
const entryChunk = buildResult.output.find((output) => output.type === 'chunk' && output.isEntry)
if (!entryChunk) throw new Error('Could not compile the prompt catalog for validation')
const catalogModuleUrl = `data:text/javascript;base64,${Buffer.from(entryChunk.code).toString('base64')}`
const { categories, loadPromptCatalog } = await import(catalogModuleUrl)

{
  const items = await loadPromptCatalog()
  const categoryIds = new Set(categories.map((category) => category.id))
  const errors = []
  const ids = new Map()

  for (const [index, item] of items.entries()) {
    const label = item.id || `catalog item ${index + 1}`
    for (const field of REQUIRED_FIELDS) {
      if (!String(item[field] ?? '').trim()) errors.push(`${label}: missing ${field}`)
    }

    if (item.id) {
      if (ids.has(item.id)) errors.push(`${label}: duplicate id (first seen at item ${ids.get(item.id) + 1})`)
      else ids.set(item.id, index)
    }
    if (item.category && !categoryIds.has(item.category)) errors.push(`${label}: unknown category "${item.category}"`)
    if (item.ratio && !VALID_RATIOS.has(item.ratio)) errors.push(`${label}: invalid ratio "${item.ratio}"`)

    const sources = itemSources(item)
    if (!sources.length) errors.push(`${label}: missing source`)
    sources.forEach((source, sourceIndex) => {
      if (!validHttpUrl(source?.url)) errors.push(`${label}: invalid source URL at position ${sourceIndex + 1}`)
    })

    for (const [pattern, wrapper] of UNCLEAN_PROMPT_PATTERNS) {
      if (pattern.test(item.prompt)) errors.push(`${label}: unclean ${wrapper} remains in normalized prompt`)
    }
  }

  printDuplicateWarning('title', duplicateGroups(items, 'title'))
  printDuplicateWarning('prompt', duplicateGroups(items, 'prompt'))

  if (errors.length) {
    console.error(`\nFAIL  ${errors.length} catalog error(s) found across ${items.length} cases`)
    errors.slice(0, 50).forEach((error) => console.error(`      ${error}`))
    if (errors.length > 50) console.error(`      ...and ${errors.length - 50} more error(s)`)
    process.exitCode = 1
  } else {
    console.log(`PASS  ${items.length} cases · unique IDs · required fields · sources · normalized prompts`)
  }
}
