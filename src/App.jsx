import { createContext, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  Eye,
  EyeOff,
  Heart,
  History,
  KeyRound,
  Languages,
  LoaderCircle,
  Upload,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { categories, loadPromptCatalog, PROJECT_REPO } from './data.js'
import {
  clearGenerationRecords,
  deleteGenerationRecord,
  loadGenerationRecords,
  migrateGenerationRecords,
  revokeGenerationRecordAssets,
  saveGenerationRecord,
} from './history-storage.js'

const CATEGORY_LABELS = new Map(categories.map((item) => [item.id, item.label]))
const LANGUAGE_KEY = 'prompt-signal:language:v1'
const FAVORITES_KEY = 'prompt-signal:favorites:v1'
const IMAGE_API_CONFIG_KEY = 'prompt-signal:image-api:v1'
const GENERATION_HISTORY_KEY = 'prompt-signal:generation-history:v1'
const MAX_GENERATION_HISTORY = 30
const GALLERY_PAGE_SIZE = 48
const MAX_REFERENCE_IMAGES = 8
const PROMPT_QUERY_KEY = 'prompt'
const DEFAULT_API_CONFIG = {
  protocol: 'images',
  endpoint: '',
  apiKey: '',
  model: '',
  size: 'auto',
  quality: 'auto',
}

const PROMPT_STATUS_LABELS = {
  template: 'PROMPT FORMAT · EDITABLE TEMPLATE',
  structured: 'PROMPT FORMAT · STRUCTURED',
  bilingual: 'PROMPT FORMAT · BILINGUAL',
  reconstructed: 'PROMPT FORMAT · SOURCE-BASED EDIT',
}

const PROMPT_STATUS_LABELS_ZH = {
  template: 'PROMPT 格式 · 可编辑模板',
  structured: 'PROMPT 格式 · 结构化',
  bilingual: 'PROMPT 格式 · 双语',
  reconstructed: 'PROMPT 格式 · 来源整理',
}

const CATEGORY_TRANSLATIONS = {
  all: { en: 'All', zh: '全部' },
  photography: { en: 'Photography', zh: '摄影写实' },
  product: { en: 'Product', zh: '商业产品' },
  poster: { en: 'Poster & Type', zh: '海报字体' },
  illustration: { en: 'Illustration', zh: '插画艺术' },
  technical: { en: 'Infographic', zh: '图表信息图' },
  ui: { en: 'UI', zh: 'UI 界面' },
  characters: { en: 'Characters', zh: '角色人物' },
  anime: { en: 'Anime', zh: '动漫' },
  isometric: { en: 'Isometric', zh: '等距模型' },
  brand: { en: 'Branding', zh: '品牌 Logo' },
  scenes: { en: 'Scenes', zh: '场景叙事' },
  architecture: { en: 'Architecture', zh: '建筑空间' },
  documents: { en: 'Documents', zh: '文档出版' },
  history: { en: 'Classic', zh: '历史古典' },
  other: { en: 'Other', zh: '其他玩法' },
}

const TRANSLATIONS = {
  en: {
    'brand.home': 'Prompt Signal home',
    'search.placeholder': 'Search styles, authors, prompts...',
    'search.label': 'Search prompts',
    'search.clear': 'Clear search',
    'actions.label': 'Quick actions',
    'actions.search': 'Search',
    'actions.favorites': 'Favorites',
    'actions.history': 'Generation history',
    'actions.settings': 'Image model settings',
    'actions.language': 'Switch to Chinese',
    'actions.closeSettings': 'Close settings',
    'actions.closeHistory': 'Close generation history',
    'actions.showKey': 'Show API key',
    'actions.hideKey': 'Hide API key',
    'actions.previous': 'Previous case',
    'actions.next': 'Next case',
    'actions.favorite': 'Add to favorites',
    'actions.unfavorite': 'Remove from favorites',
    'settings.eyebrow': 'IMAGE ENGINE',
    'settings.title': 'Image model settings',
    'settings.note': 'Settings stay in this browser and are sent only when you generate. Choose the protocol implemented by your endpoint.',
    'settings.protocol': 'API PROTOCOL',
    'settings.protocolImages': 'Images API',
    'settings.protocolGenerateContent': 'GenerateContent API',
    'settings.apiUrl': 'API URL',
    'settings.apiKey': 'API KEY',
    'settings.model': 'MODEL',
    'settings.modelPlaceholder': 'e.g. gpt-image-2',
    'settings.endpointPlaceholder': 'https://your-endpoint.example/v1/images/generations',
    'settings.generateContentPlaceholder': 'https://your-endpoint.example/v1beta',
    'settings.save': 'Save settings',
    'settings.clear': 'Clear local settings',
    'settings.security': 'Stored locally in this browser · never uploaded to Prompt Signal',
    'history.eyebrow': 'LOCAL ARCHIVE',
    'history.title': 'Generation history',
    'history.records': '{{count}} / {{max}} RECORDS',
    'history.clear': 'Clear history',
    'history.delete': 'Delete generation record',
    'history.loading': 'Loading local generation history...',
    'history.open': 'Open generation record',
    'history.resultAlt': '{{title}} generated result',
    'history.reference': 'REFERENCE · {{name}}',
    'history.emptyTitle': 'No generation history yet',
    'history.emptyCopy': 'Generated images will appear here after you create them from a case.',
    'intro.note': 'A working index of GPT-Image-2 prompts\nfrom the X and GitHub community',
    'intro.curated': 'CURATED',
    'filters.tabs': 'Prompt categories',
    'filters.results': '{{count}} RESULTS',
    'filters.sort': 'Sort results',
    'filters.newest': 'Newest first',
    'filters.relevance': 'Best match',
    'filters.curated': 'Curated order',
    'filters.title': 'Title A–Z',
    'gallery.view': 'VIEW PROMPT',
    'gallery.unavailable': 'IMAGE UNAVAILABLE',
    'gallery.loading': 'Loading prompt catalog...',
    'gallery.viewDetails': 'View {{title}} details',
    'empty.noFavorites': 'No favorites yet',
    'empty.noMatch': 'No matching prompts',
    'empty.viewAll': 'View all cases',
    'loadMore.button': 'Load more cases',
    'loadMore.status': '{{shown}} / {{total}} shown · Keep exploring the full archive',
    'detail.close': 'CLOSE',
    'detail.expand': 'CLICK TO EXPAND',
    'detail.source': 'SOURCE',
    'detail.generated': 'GENERATED',
    'detail.curatedBy': 'CURATED BY {{author}}',
    'detail.prompt': 'PROMPT',
    'detail.templateVariables': 'TEMPLATE VARIABLES',
    'detail.templateHint': 'Fill reusable placeholders, then apply them to the editable prompt.',
    'detail.applyVariables': 'Apply variables',
    'detail.originalPrompt': 'View original source prompt',
    'detail.copyOriginal': 'Copy original',
    'detail.chars': 'CHAR',
    'detail.reference': 'REFERENCE IMAGES',
    'detail.optional': 'OPTIONAL',
    'detail.referenceUpload': 'Upload local reference images',
    'detail.referenceAdd': 'Add more images',
    'detail.referenceHint': 'PNG / JPG / WEBP · Up to 8 images',
    'detail.referenceCount': '{{count}} ATTACHED',
    'detail.referenceRemove': 'Remove reference image',
    'detail.referenceAlt': 'Reference image preview',
    'detail.copy': 'Copy prompt',
    'detail.share': 'Copy case link',
    'detail.generate': 'Generate',
    'detail.checkSettings': 'Check settings',
    'detail.download': 'Download generated result',
    'detail.historyLabel': 'GENERATED HISTORY',
    'detail.historyMeta': '{{model}} · {{size}} · {{quality}}',
    'detail.loading': 'Rendering image…',
    'detail.confirmEyebrow': 'READY TO RENDER',
    'detail.confirmTitle': 'Generate this image?',
    'detail.confirmCopy': 'Your edited prompt will be sent to the configured image model. The request starts only after confirmation.',
    'detail.confirmPrompt': 'PROMPT · EDIT AGAIN BEFORE GENERATING',
    'detail.confirmPreview': 'Click thumbnail to enlarge',
    'detail.confirmAttached': 'ATTACHED',
    'detail.confirmNone': 'NONE',
    'detail.confirmCancel': 'Cancel',
    'detail.confirmSubmit': 'Confirm generation',
    'detail.cancelGeneration': 'Cancel generation',
    'detail.preview': 'Image preview',
    'errors.fetch': 'Could not reach the endpoint. Check the URL, CORS, or network settings.',
    'errors.request': 'Request failed (HTTP {{status}}).',
    'errors.imageResponse': 'The endpoint returned no image URL or b64_json.',
    'errors.invalidFile': 'Choose a PNG, JPEG, or WEBP image file.',
    'errors.tooManyFiles': 'You can attach up to {{max}} reference images.',
    'errors.fileRead': 'A reference image could not be read.',
    'toast.copied': 'Prompt copied to clipboard',
    'toast.linkCopied': 'Case link copied to clipboard',
    'toast.settingsSaved': 'Image model settings saved',
    'footer': 'OPEN PROMPTS · REAL OUTPUTS · 2026',
  },
  zh: {
    'brand.home': 'Prompt Signal 首页',
    'search.placeholder': '搜索风格、作者、Prompt...',
    'search.label': '搜索 Prompt',
    'search.clear': '清空搜索',
    'actions.label': '快捷操作',
    'actions.search': '搜索',
    'actions.favorites': '收藏',
    'actions.history': '生成记录',
    'actions.settings': '图片模型配置',
    'actions.language': '切换为英文',
    'actions.closeSettings': '关闭配置',
    'actions.closeHistory': '关闭生成记录',
    'actions.showKey': '显示 API Key',
    'actions.hideKey': '隐藏 API Key',
    'actions.previous': '上一个案例',
    'actions.next': '下一个案例',
    'actions.favorite': '收藏',
    'actions.unfavorite': '取消收藏',
    'settings.eyebrow': 'IMAGE ENGINE',
    'settings.title': '图片模型配置',
    'settings.note': '配置会保存在当前浏览器，仅在点击生成时发送。请选择接口实际实现的请求协议。',
    'settings.protocol': 'API 协议',
    'settings.protocolImages': 'Images API',
    'settings.protocolGenerateContent': 'GenerateContent API',
    'settings.apiUrl': 'API URL',
    'settings.apiKey': 'API KEY',
    'settings.model': 'MODEL',
    'settings.modelPlaceholder': '例如 gpt-image-2',
    'settings.endpointPlaceholder': 'https://your-endpoint.example/v1/images/generations',
    'settings.generateContentPlaceholder': 'https://your-endpoint.example/v1beta',
    'settings.save': '保存配置',
    'settings.clear': '清除本地配置',
    'settings.security': '浏览器本地保存 · 不会上传到 Prompt Signal',
    'history.eyebrow': 'LOCAL ARCHIVE',
    'history.title': '生成记录',
    'history.records': '{{count}} / {{max}} RECORDS',
    'history.clear': '清空记录',
    'history.delete': '删除这条生成记录',
    'history.loading': '正在读取本地生成记录…',
    'history.open': '查看生成记录',
    'history.resultAlt': '{{title}} 生成结果',
    'history.reference': 'REFERENCE · {{name}}',
    'history.emptyTitle': '还没有生成记录',
    'history.emptyCopy': '在案例详情中生成图片后，结果会自动保存在这里。',
    'intro.note': '从 X 与 GitHub 热门案例中筛选的\nGPT-Image-2 实战灵感库',
    'intro.curated': '精选',
    'filters.tabs': '案例类型',
    'filters.results': '{{count}} 结果',
    'filters.sort': '排序方式',
    'filters.newest': '最新添加',
    'filters.relevance': '最佳匹配',
    'filters.curated': '精选排序',
    'filters.title': '标题排序',
    'gallery.view': '查看 Prompt',
    'gallery.unavailable': '图片不可用',
    'gallery.loading': '正在加载案例目录…',
    'gallery.viewDetails': '查看 {{title}} 详情',
    'empty.noFavorites': '还没有收藏案例',
    'empty.noMatch': '没有匹配的 Prompt',
    'empty.viewAll': '查看全部案例',
    'loadMore.button': '加载更多案例',
    'loadMore.status': '已显示 {{shown}} / {{total}} · 向下探索完整案例库',
    'detail.close': '关闭',
    'detail.expand': '点击放大',
    'detail.source': '原图',
    'detail.generated': '生成图',
    'detail.curatedBy': 'CURATED BY {{author}}',
    'detail.prompt': 'PROMPT',
    'detail.templateVariables': '模板变量',
    'detail.templateHint': '填写可复用占位符，然后应用到下方可编辑 Prompt。',
    'detail.applyVariables': '应用变量',
    'detail.originalPrompt': '查看来源原始 Prompt',
    'detail.copyOriginal': '复制原始 Prompt',
    'detail.chars': '字符',
    'detail.reference': 'REFERENCE IMAGES',
    'detail.optional': '可选',
    'detail.referenceUpload': '上传本地参考图片',
    'detail.referenceAdd': '继续添加图片',
    'detail.referenceHint': 'PNG / JPG / WEBP · 最多 8 张',
    'detail.referenceCount': '已附加 {{count}} 张',
    'detail.referenceRemove': '移除参考图',
    'detail.referenceAlt': '待上传的参考图',
    'detail.copy': '复制 Prompt',
    'detail.share': '复制案例链接',
    'detail.generate': '生成',
    'detail.checkSettings': '检查配置',
    'detail.download': '下载生成结果',
    'detail.historyLabel': 'GENERATED HISTORY',
    'detail.historyMeta': '{{model}} · {{size}} · {{quality}}',
    'detail.loading': '正在生成图像…',
    'detail.confirmEyebrow': 'READY TO RENDER',
    'detail.confirmTitle': '确认生成这张图片？',
    'detail.confirmCopy': '将使用当前编辑后的 Prompt 调用已配置的图片模型。确认后才会发起请求。',
    'detail.confirmPrompt': 'PROMPT · 可在这里二次编辑',
    'detail.confirmPreview': '点击缩略图放大预览',
    'detail.confirmAttached': '已附加',
    'detail.confirmNone': '无',
    'detail.confirmCancel': '取消',
    'detail.confirmSubmit': '确认生成',
    'detail.cancelGeneration': '取消生成',
    'detail.preview': '图片预览',
    'errors.fetch': '无法连接接口。请检查 URL、CORS 或网络设置。',
    'errors.request': '请求失败（HTTP {{status}}）。',
    'errors.imageResponse': '接口没有返回图片 URL 或 b64_json。',
    'errors.invalidFile': '请选择 PNG、JPEG 或 WEBP 图片文件。',
    'errors.tooManyFiles': '最多可以附加 {{max}} 张参考图片。',
    'errors.fileRead': '无法读取其中一张参考图片。',
    'toast.copied': 'Prompt 已复制到剪贴板',
    'toast.linkCopied': '案例链接已复制',
    'toast.settingsSaved': '图片模型配置已保存',
    'footer': 'OPEN PROMPTS · REAL OUTPUTS · 2026',
  },
}

const LanguageContext = createContext(null)
let openDialogCount = 0

function isEditableTarget(target) {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || target?.isContentEditable
}

function readPromptIdFromLocation() {
  if (typeof window === 'undefined') return null
  return new URL(window.location.href).searchParams.get(PROMPT_QUERY_KEY)
}

function updatePromptUrl(promptId, mode = 'replace') {
  const url = new URL(window.location.href)
  if (promptId) url.searchParams.set(PROMPT_QUERY_KEY, promptId)
  else url.searchParams.delete(PROMPT_QUERY_KEY)
  const previousState = window.history.state || {}
  const openedFromGallery = mode === 'push' || previousState.promptSignalDetail === true
  const state = { ...previousState, promptSignalDetail: Boolean(promptId && openedFromGallery) }
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](state, '', url)
}

function useDialogFocus(active, onEscape) {
  const dialogRef = useRef(null)
  const escapeRef = useRef(onEscape)
  escapeRef.current = onEscape

  useEffect(() => {
    if (!active) return undefined
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const previousFocus = document.activeElement
    const siblings = [...(dialog.parentElement?.children || [])]
      .filter((element) => element !== dialog)
      .map((element) => ({ element, ariaHidden: element.getAttribute('aria-hidden'), inert: element.inert }))

    siblings.forEach(({ element }) => {
      element.setAttribute('aria-hidden', 'true')
      element.inert = true
    })

    openDialogCount += 1
    document.body.classList.add('modal-open')

    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusFirst = () => {
      const firstFocusable = dialog.querySelector(focusableSelector)
      ;(firstFocusable || dialog).focus({ preventScroll: true })
    }
    const frame = window.requestAnimationFrame(focusFirst)

    const onKeyDown = (event) => {
      const dialogs = [...document.querySelectorAll('[data-dialog-layer="true"]')]
      if (dialogs.at(-1) !== dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        escapeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...dialog.querySelectorAll(focusableSelector)].filter((element) => !element.inert && element.offsetParent !== null)
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
        return
      }
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      siblings.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden == null) element.removeAttribute('aria-hidden')
        else element.setAttribute('aria-hidden', ariaHidden)
        element.inert = inert
      })
      openDialogCount = Math.max(0, openDialogCount - 1)
      if (!openDialogCount) document.body.classList.remove('modal-open')
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [active])

  return dialogRef
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) === 'zh' ? 'zh' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language)
    } catch {
      // Private browsing may disable localStorage; language still works for this session.
    }
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  const t = (key, values = {}) => {
    const template = TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key
    return Object.entries(values).reduce((result, [name, value]) => result.replaceAll(`{{${name}}}`, String(value)), template)
  }

  return <LanguageContext.Provider value={{ language, t, toggleLanguage: () => setLanguage((value) => value === 'en' ? 'zh' : 'en') }}>{children}</LanguageContext.Provider>
}

function useLanguage() {
  return useContext(LanguageContext)
}

function categoryLabel(id, language) {
  return CATEGORY_TRANSLATIONS[id]?.[language] || CATEGORY_LABELS.get(id) || id
}

function getItemSources(item) {
  const candidates = item.sources ?? item.sourceLinks ?? item.source
  if (Array.isArray(candidates)) {
    return candidates
      .map((source, index) => typeof source === 'string' ? { label: `${item.sourceLabel || 'SOURCE'} ${index + 1}`, url: source } : source)
      .filter((source) => source?.url)
      .map((source) => ({ ...source, label: source.label || source.platform || 'SOURCE' }))
  }
  return candidates ? [{ label: item.sourceLabel || 'SOURCE', url: candidates }] : []
}

function scorePromptMatch(item, query) {
  const terms = query.split(/\s+/).filter(Boolean)
  const fields = [
    [String(item.title || '').toLowerCase(), 120],
    [String(item.author || '').toLowerCase(), 80],
    [String(item.category || '').toLowerCase(), 60],
    [String(item.sourceLabel || '').toLowerCase(), 35],
    [String(item.prompt || '').toLowerCase(), 10],
  ]
  let score = 0
  for (const term of terms) {
    const field = fields.find(([value]) => value.includes(term))
    if (!field) return -1
    score += field[1]
    if (fields[0][0].startsWith(term)) score += 40
  }
  return score
}

function createTemplateValues(variables) {
  return Object.fromEntries((variables || []).map((variable) => [variable.key, variable.defaultValue || '']))
}

function replaceFirst(value, search, replacement) {
  const index = value.indexOf(search)
  return index < 0 ? value : `${value.slice(0, index)}${replacement}${value.slice(index + search.length)}`
}

function applyPromptVariables(prompt, variables, values, previousValues) {
  let next = prompt
  variables.forEach((variable) => {
    const value = String(values[variable.key] ?? '').trim()
    if (!value) return
    const previousValue = previousValues[variable.key]
    if (variable.kind === 'placeholder') {
      if (next.includes(variable.token)) next = next.split(variable.token).join(value)
      else if (previousValue && previousValue !== value) next = next.split(previousValue).join(value)
      return
    }
    const target = previousValue || variable.defaultValue
    if (target && target !== value) next = replaceFirst(next, target, value)
  })
  return next
}

function resolveGenerateContentEndpoint(endpoint, model) {
  const base = endpoint.trim().replace(/\/+$/, '')
  if (base.includes('{model}')) return base.replace('{model}', encodeURIComponent(model))
  if (/\/models\/[^/]+:(?:generateContent|streamGenerateContent)$/i.test(base)) return base
  const modelsBase = /\/models$/i.test(base) ? base : `${base}/models`
  return `${modelsBase}/${encodeURIComponent(model)}:generateContent`
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || '').split(',', 2)[1] || '')
    reader.onerror = () => reject(reader.error || new Error('Could not read reference image'))
    reader.readAsDataURL(file)
  })
}

function imageConfigForSize(size) {
  const aspectRatio = {
    '1024x1024': '1:1',
    '1536x1024': '3:2',
    '1024x1536': '2:3',
  }[size]
  return aspectRatio ? { aspectRatio } : null
}

function extractGeneratedImage(payload) {
  const imageOutput = payload?.data?.[0]
  if (imageOutput?.url) return imageOutput.url
  if (imageOutput?.b64_json) return `data:image/png;base64,${imageOutput.b64_json}`

  const parts = (payload?.candidates || []).flatMap((candidate) => candidate?.content?.parts || [])
  const inlineImage = parts
    .map((part) => part?.inlineData || part?.inline_data)
    .find((inlineData) => inlineData?.data)
  if (!inlineImage) return ''
  return `data:${inlineImage.mimeType || inlineImage.mime_type || 'image/png'};base64,${inlineImage.data}`
}

async function generateImageRequest({ config, prompt, referenceFiles, t }) {
  let endpoint = config.endpoint.trim()
  const headers = {}
  let body

  if (config.protocol === 'generate-content') {
    endpoint = resolveGenerateContentEndpoint(endpoint, config.model.trim())
    headers['Content-Type'] = 'application/json'
    headers['x-goog-api-key'] = config.apiKey.trim()
    const imageParts = await Promise.all(referenceFiles.map(async (file) => ({
      inlineData: {
        mimeType: file.type,
        data: await fileToBase64(file),
      },
    })))
    const imageConfig = imageConfigForSize(config.size)
    body = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        ...(imageConfig ? { imageConfig } : {}),
      },
    })
  } else {
    headers.Authorization = `Bearer ${config.apiKey.trim()}`
    if (referenceFiles.length) {
      endpoint = endpoint.replace(/\/generations\/?$/, '/edits')
      body = new FormData()
      const imageField = referenceFiles.length > 1 ? 'image[]' : 'image'
      referenceFiles.forEach((file) => body.append(imageField, file))
      body.append('model', config.model.trim())
      body.append('prompt', prompt)
      body.append('size', config.size)
      body.append('quality', config.quality)
      body.append('n', '1')
    } else {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify({ model: config.model.trim(), prompt, size: config.size, quality: config.quality, n: 1 })
    }
  }

  const response = await fetch(endpoint, { method: 'POST', headers, body })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error?.message || payload?.message || t('errors.request', { status: response.status }))
  const generatedImage = extractGeneratedImage(payload)
  if (!generatedImage) throw new Error(t('errors.imageResponse'))
  return generatedImage
}

function GithubMark({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.25c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>
}

function BrandMark({ size = 31 }) {
  return (
    <svg className="brand-mark-art" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path className="brand-mark-letter" d="M8.5 7h7.1c4.7 0 7.5 2.4 7.5 6.2s-2.8 6.2-7.5 6.2h-3.2V25H8.5V7Zm3.9 3.5v5.4h3c2.3 0 3.7-.8 3.7-2.7s-1.4-2.7-3.7-2.7h-3Z" />
      <path className="brand-mark-cut" d="M21.2 21.9 24.6 18.5" />
    </svg>
  )
}

function readFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function readApiConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(IMAGE_API_CONFIG_KEY) || '{}')
    // Clear the old built-in OpenAI defaults so a first-time setup starts blank.
    if (stored.endpoint === 'https://api.openai.com/v1/images/generations' && !stored.apiKey) {
      return DEFAULT_API_CONFIG
    }
    return { ...DEFAULT_API_CONFIG, ...stored, size: stored.size || 'auto' }
  } catch {
    return DEFAULT_API_CONFIG
  }
}

function readGenerationHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(GENERATION_HISTORY_KEY) || '[]')
    return Array.isArray(stored) ? stored.filter((record) => record?.id && record?.image && record?.prompt) : []
  } catch {
    return []
  }
}

function writeGenerationHistory(records) {
  const next = records.slice(0, MAX_GENERATION_HISTORY)
  try {
    localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(next))
    return next
  } catch {
    // Reference previews are optional; remove them first if a base64 result fills localStorage.
    const withoutReferences = next.map(({ referencePreview, ...record }) => record)
    try {
      localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(withoutReferences))
      return withoutReferences
    } catch {
      const compact = withoutReferences.slice(0, 8)
      try {
        localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(compact))
        return compact
      } catch {
        return records
      }
    }
  }
}

function formatHistoryDate(value, language = 'en') {
  try {
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  } catch {
    return language === 'zh' ? '刚刚' : 'Just now'
  }
}

function IconButton({ label, children, className = '', ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  )
}

function Header({ search, setSearch, favoriteCount, showFavorites, setShowFavorites, historyCount, onHistory, onSettings }) {
  const [mobileSearch, setMobileSearch] = useState(false)
  const { language, t, toggleLanguage } = useLanguage()

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={t('brand.home')}>
        <span className="brand-mark"><BrandMark /></span>
        <span>PROMPT<span>/SIGNAL</span></span>
      </a>

      <div className={`search-shell ${mobileSearch ? 'is-open' : ''}`}>
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.label')}
        />
        {search ? (
          <button className="search-clear" onClick={() => setSearch('')} aria-label={t('search.clear')}>
            <X size={15} />
          </button>
        ) : null}
      </div>

      <nav className="header-actions" aria-label={t('actions.label')}>
        <IconButton label={t('actions.search')} className="mobile-only" onClick={() => setMobileSearch((value) => !value)}>
          <Search size={19} />
        </IconButton>
        <button
          className={`favorites-button ${showFavorites ? 'is-active' : ''}`}
          onClick={() => setShowFavorites((value) => !value)}
          aria-pressed={showFavorites}
          aria-label={t('actions.favorites')}
        >
          <Heart size={18} fill={showFavorites ? 'currentColor' : 'none'} />
          <span>{t('actions.favorites')}</span>
          <b>{favoriteCount}</b>
        </button>
        <button className="history-button" onClick={onHistory} aria-label={t('actions.history')} title={t('actions.history')}>
          <History size={18} />
          <span>{t('actions.history')}</span>
          <b>{historyCount}</b>
        </button>
        <IconButton label={t('actions.settings')} onClick={onSettings}>
          <Settings2 size={18} />
        </IconButton>
        <button className="language-button" onClick={toggleLanguage} aria-label={t('actions.language')} title={t('actions.language')}>
          <Languages size={17} />
          <span>{language === 'en' ? '中文' : 'EN'}</span>
        </button>
        <a className="repo-button" href={PROJECT_REPO.url} target="_blank" rel="noreferrer" title={PROJECT_REPO.name}>
          <GithubMark size={18} />
          <span className="repo-label">GitHub</span>
          {Number(PROJECT_REPO.stars) > 100 ? <span>{PROJECT_REPO.stars}</span> : null}
          <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  )
}

function SettingsPanel({ config, onChange, onSave, onClear, onClose }) {
  const [showKey, setShowKey] = useState(false)
  const { t } = useLanguage()
  const dialogRef = useDialogFocus(true, onClose)
  return (
    <div ref={dialogRef} className="settings-backdrop" role="dialog" aria-modal="true" aria-label={t('settings.title')} data-dialog-layer="true" tabIndex={-1}>
      <div className="settings-panel">
        <div className="settings-heading">
          <div><span>{t('settings.eyebrow')}</span><h2>{t('settings.title')}</h2></div>
          <IconButton label={t('actions.closeSettings')} onClick={onClose}><X size={19} /></IconButton>
        </div>
        <p className="settings-note">{t('settings.note')}</p>
        <label className="settings-field"><span>{t('settings.protocol')}</span><select value={config.protocol} onChange={(e) => onChange({ protocol: e.target.value })}><option value="images">{t('settings.protocolImages')}</option><option value="generate-content">{t('settings.protocolGenerateContent')}</option></select></label>
        <label className="settings-field"><span>{t('settings.apiUrl')}</span><input value={config.endpoint} onChange={(e) => onChange({ endpoint: e.target.value })} placeholder={config.protocol === 'generate-content' ? t('settings.generateContentPlaceholder') : t('settings.endpointPlaceholder')} /></label>
        <label className="settings-field"><span>{t('settings.apiKey')}</span><div className="key-input"><input type={showKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => onChange({ apiKey: e.target.value })} placeholder="your-api-key" autoComplete="off" /><IconButton label={showKey ? t('actions.hideKey') : t('actions.showKey')} onClick={() => setShowKey((v) => !v)}>{showKey ? <EyeOff size={17} /> : <Eye size={17} />}</IconButton></div></label>
        <div className={`settings-grid ${config.protocol === 'generate-content' ? 'is-generate-content' : ''}`}>
          <label className="settings-field"><span>{t('settings.model')}</span><input value={config.model} onChange={(e) => onChange({ model: e.target.value })} placeholder={config.protocol === 'generate-content' ? 'e.g. gemini-3.1-flash-image' : t('settings.modelPlaceholder')} /></label>
          <label className="settings-field"><span>SIZE</span><select value={config.size} onChange={(e) => onChange({ size: e.target.value })}><option>auto</option><option>1024x1024</option><option>1536x1024</option><option>1024x1536</option></select></label>
          {config.protocol === 'images' ? <label className="settings-field"><span>QUALITY</span><select value={config.quality} onChange={(e) => onChange({ quality: e.target.value })}><option>auto</option><option>low</option><option>medium</option><option>high</option></select></label> : null}
        </div>
        <div className="settings-actions"><button className="settings-save" onClick={onSave}><Check size={17} />{t('settings.save')}</button><button className="settings-clear" onClick={onClear}>{t('settings.clear')}</button></div>
        <div className="settings-security"><KeyRound size={14} />{t('settings.security')}</div>
      </div>
    </div>
  )
}

function HistoryPanel({ records, loading, onOpen, onDelete, onClear, onClose }) {
  const { language, t } = useLanguage()
  const dialogRef = useDialogFocus(true, onClose)
  return (
    <div ref={dialogRef} className="history-backdrop" role="dialog" aria-modal="true" aria-label={t('history.title')} data-dialog-layer="true" tabIndex={-1}>
      <div className="history-panel">
        <div className="history-heading">
          <div><span>{t('history.eyebrow')}</span><h2>{t('history.title')}</h2></div>
          <IconButton label={t('actions.closeHistory')} onClick={onClose}><X size={19} /></IconButton>
        </div>
        <div className="history-toolbar">
          <span>{t('history.records', { count: records.length, max: MAX_GENERATION_HISTORY })}</span>
          {records.length ? <button onClick={onClear}><Trash2 size={14} />{t('history.clear')}</button> : null}
        </div>
        {loading ? (
          <div className="history-empty"><LoaderCircle size={28} className="spin" /><p>{t('history.loading')}</p></div>
        ) : records.length ? (
          <div className="history-grid">
            {records.map((record) => (
              <article className="history-card" key={record.id}>
                <button className="history-card-image" onClick={() => onOpen(record)} aria-label={t('history.open')}>
                  <img src={record.image} alt={t('history.resultAlt', { title: record.title })} />
                  <span>OPEN <ArrowUpRight size={14} /></span>
                </button>
                <div className="history-card-info">
                  <IconButton className="history-card-delete" label={t('history.delete')} onClick={() => onDelete(record)}><Trash2 size={14} /></IconButton>
                  <div>
                    <span>{formatHistoryDate(record.createdAt, language)} · {record.model || 'IMAGE MODEL'}</span>
                    <h3>{record.title}</h3>
                  </div>
                  <p>{record.prompt}</p>
                  {record.referenceName ? <small>{t('history.reference', { name: record.referenceName })}</small> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <History size={28} />
            <h3>{t('history.emptyTitle')}</h3>
            <p>{t('history.emptyCopy')}</p>
          </div>
        )}
      </div>
    </div>
  )
}


function Intro({ count }) {
  const { t } = useLanguage()
  return (
    <section className="intro" id="top">
      <div className="intro-title">
        <h1>Image prompts<br /><em>worth stealing.</em></h1>
      </div>
      <div className="intro-note">
        <span className="live-dot" />
        <p>{t('intro.note').split('\n').map((line, index) => <span key={line}>{index ? <br /> : null}{line}</span>)}</p>
        <strong>{count == null ? '...' : String(count).padStart(2, '0')} / {t('intro.curated')}</strong>
      </div>
    </section>
  )
}

function FilterBar({ activeCategory, setActiveCategory, resultCount, loading, searchActive, sort, setSort }) {
  const { language, t } = useLanguage()
  return (
    <div className="filter-sticky">
      <div className="filter-bar">
        <div className="category-scroll" role="tablist" aria-label={t('filters.tabs')}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? 'is-active' : ''}
              onClick={() => setActiveCategory(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
            >
              {categoryLabel(category.id, language)}
            </button>
          ))}
        </div>
        <div className="filter-meta">
          <span>{loading ? '... RESULTS' : t('filters.results', { count: String(resultCount).padStart(2, '0') })}</span>
          <label>
            <span className="sr-only">{t('filters.sort')}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">{searchActive ? t('filters.relevance') : t('filters.newest')}</option>
              <option value="curated">{t('filters.curated')}</option>
              <option value="title">{t('filters.title')}</option>
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
        </div>
      </div>
    </div>
  )
}

function GalleryCard({ item, index, favorite, onOpen, onFavorite, onMeasure }) {
  const [imageState, setImageState] = useState('loading')
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const { language, t } = useLanguage()

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    setImageState(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [item.image])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return undefined
    const measure = () => {
      const { width, height } = card.getBoundingClientRect()
      if (width > 0 && height > 0) onMeasure(item.id, height / width)
    }
    const frame = window.requestAnimationFrame(measure)
    if (!('ResizeObserver' in window)) return () => window.cancelAnimationFrame(frame)
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [item.id, onMeasure])

  return (
    <article ref={cardRef} className={`gallery-card ratio-${item.ratio}`} data-prompt-id={item.id} style={{ '--delay': `${Math.min(index, 9) * 45}ms` }}>
      <button className={`card-image is-${imageState}`} onClick={() => onOpen(item)} aria-label={t('gallery.viewDetails', { title: item.title })} aria-busy={imageState === 'loading'}>
        <span className="image-skeleton" aria-hidden="true" />
        {imageState === 'error' ? <span className="image-fallback">{t('gallery.unavailable')}</span> : null}
        <img ref={imageRef} src={item.image} alt={item.title} loading={index > 5 ? 'lazy' : 'eager'} onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} />
        <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="view-cue">{t('gallery.view')} <ArrowUpRight size={16} /></span>
      </button>
      <div className="card-info">
        <div>
          <span className="card-category">{categoryLabel(item.category, language)}</span>
          <h2>{item.title}</h2>
          <p>{item.author} · {item.sourceLabel}</p>
        </div>
        <IconButton
          label={favorite ? t('actions.unfavorite') : t('actions.favorite')}
          className={favorite ? 'favorite is-active' : 'favorite'}
          onClick={() => onFavorite(item.id)}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </IconButton>
      </div>
    </article>
  )
}

function getGalleryColumnCount() {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth <= 480) return 1
  if (window.innerWidth <= 820) return 2
  if (window.innerWidth <= 1180) return 3
  return 4
}

function estimateMasonryWeight(item) {
  const imageWeight = { portrait: 1.34, landscape: 0.78, square: 1, wide: 0.54 }[item.ratio] || 1
  const titleWeight = Math.min(0.24, Math.ceil(String(item.title || '').length / 22) * 0.06)
  return imageWeight + titleWeight + 0.26
}

function MasonryGallery({ items, favoriteIds, onOpen, onFavorite }) {
  const [columnCount, setColumnCount] = useState(getGalleryColumnCount)
  const [measurementRevision, setMeasurementRevision] = useState(0)
  const measuredWeightsRef = useRef(new Map())
  const measurementFrameRef = useRef(null)

  const handleMeasure = useCallback((id, weight) => {
    const previous = measuredWeightsRef.current.get(id)
    if (previous != null && Math.abs(previous - weight) < 0.01) return
    measuredWeightsRef.current.set(id, weight)
    if (measurementFrameRef.current) return
    measurementFrameRef.current = window.requestAnimationFrame(() => {
      measurementFrameRef.current = null
      setMeasurementRevision((revision) => revision + 1)
    })
  }, [])

  useEffect(() => {
    const handleResize = () => setColumnCount(getGalleryColumnCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => () => window.cancelAnimationFrame(measurementFrameRef.current), [])

  const columns = useMemo(() => {
    const nextColumns = Array.from({ length: columnCount }, () => [])
    const heights = Array.from({ length: columnCount }, () => 0)

    for (let layerStart = 0; layerStart < items.length; layerStart += columnCount) {
      const columnOrder = heights
        .map((height, index) => ({ height, index }))
        .sort((first, second) => first.height - second.height || first.index - second.index)
      const layer = items
        .slice(layerStart, layerStart + columnCount)
        .map((item, offset) => ({
          item,
          index: layerStart + offset,
          weight: measuredWeightsRef.current.get(item.id) || estimateMasonryWeight(item),
        }))
        .sort((first, second) => second.weight - first.weight || first.index - second.index)

      layer.forEach((entry, offset) => {
        const columnIndex = columnOrder[offset].index
        nextColumns[columnIndex].push({ item: entry.item, index: entry.index })
        heights[columnIndex] += entry.weight
      })
    }
    return nextColumns
  }, [columnCount, items, measurementRevision])

  return (
    <section className="masonry" aria-live="polite">
      {columns.map((column, columnIndex) => (
        <div className="masonry-column" key={`masonry-column-${columnIndex}`}>
          {column.map(({ item, index }) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              favorite={favoriteIds.has(item.id)}
              onOpen={onOpen}
              onFavorite={onFavorite}
              onMeasure={handleMeasure}
            />
          ))}
        </div>
      ))}
    </section>
  )
}

function CatalogSkeleton() {
  const { t } = useLanguage()
  return (
    <section className="catalog-skeleton" aria-live="polite" aria-label={t('gallery.loading')}>
      {Array.from({ length: 8 }, (_, index) => <span key={index} aria-hidden="true" />)}
      <p><LoaderCircle size={16} className="spin" />{t('gallery.loading')}</p>
    </section>
  )
}

function EmptyState({ showFavorites, clearFilters }) {
  const { t } = useLanguage()
  return (
    <div className="empty-state">
      <span>NO SIGNAL</span>
      <h2>{showFavorites ? t('empty.noFavorites') : t('empty.noMatch')}</h2>
      <button onClick={clearFilters}>{t('empty.viewAll')}</button>
    </div>
  )
}

function DetailView({ item, favorite, onFavorite, onClose, onPrev, onNext, onCopy, onCopyLink, config, onOpenSettings, onGenerationComplete }) {
  const isHistoryItem = item.kind === 'generation-history'
  const { language, t } = useLanguage()
  const [promptText, setPromptText] = useState(item.prompt)
  const [generatedUrl, setGeneratedUrl] = useState(item.generatedUrl || '')
  const [viewMode, setViewMode] = useState(item.generatedUrl ? 'generated' : 'source')
  const [generationState, setGenerationState] = useState('idle')
  const [generationError, setGenerationError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [referenceImages, setReferenceImages] = useState([])
  const [zoomedImage, setZoomedImage] = useState(null)
  const [templateValues, setTemplateValues] = useState(() => createTemplateValues(item.promptVariables))
  const referenceImagesRef = useRef([])
  const appliedTemplateValuesRef = useRef({})
  const detailDialogRef = useDialogFocus(true, onClose)
  const confirmDialogRef = useDialogFocus(confirmOpen, () => setConfirmOpen(false))
  const lightboxDialogRef = useDialogFocus(Boolean(zoomedImage), () => setZoomedImage(null))

  useEffect(() => {
    setPromptText(item.prompt)
    setGeneratedUrl(item.generatedUrl || '')
    setViewMode(item.generatedUrl ? 'generated' : 'source')
    setGenerationState('idle')
    setGenerationError('')
    setReferenceImages((current) => {
      current.forEach((reference) => URL.revokeObjectURL(reference.preview))
      return []
    })
    setZoomedImage(null)
    setTemplateValues(createTemplateValues(item.promptVariables))
    appliedTemplateValuesRef.current = {}
  }, [item.id, item.prompt, item.promptVariables])

  useEffect(() => {
    referenceImagesRef.current = referenceImages
  }, [referenceImages])

  useEffect(() => () => {
    referenceImagesRef.current.forEach((reference) => URL.revokeObjectURL(reference.preview))
  }, [])

  const templateVariables = item.promptVariables || []

  const applyTemplateVariables = () => {
    const previousValues = appliedTemplateValuesRef.current
    setPromptText((current) => applyPromptVariables(current, templateVariables, templateValues, previousValues))
    appliedTemplateValuesRef.current = { ...templateValues }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const dialogs = [...document.querySelectorAll('[data-dialog-layer="true"]')]
      if (dialogs.at(-1) !== detailDialogRef.current || isEditableTarget(event.target)) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onPrev()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [detailDialogRef, onNext, onPrev])

  const runGeneration = async () => {
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    setGenerationState('loading')
    setGenerationError('')
    try {
      const url = await generateImageRequest({
        config,
        prompt: promptText,
        referenceFiles: referenceImages.map((reference) => reference.file),
        t,
      })
      setGeneratedUrl(url)
      setViewMode('generated')
      setGenerationState('success')
      onGenerationComplete?.({
        id: `generation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        itemId: item.id,
        title: item.title,
        category: item.category,
        prompt: promptText,
        image: url,
        model: config.model.trim(),
        size: config.size,
        quality: config.quality,
        createdAt: new Date().toISOString(),
        referenceName: referenceImages.map((reference) => reference.file.name).join(', '),
      })
    } catch (error) {
      const message = error?.message || (language === 'zh' ? '生成失败' : 'Generation failed')
      setGenerationError(message.includes('Failed to fetch')
        ? t('errors.fetch')
        : message.includes('Could not read reference image') ? t('errors.fileRead') : message)
      setGenerationState('error')
    }
  }

  const requestGeneration = () => {
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    setGenerationError('')
    setConfirmOpen(true)
  }

  const handleReferenceChange = (event) => {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    if (!files.length) return
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setGenerationError(t('errors.invalidFile'))
      setGenerationState('error')
      return
    }
    const existingKeys = new Set(referenceImages.map((reference) => `${reference.file.name}-${reference.file.size}-${reference.file.lastModified}`))
    const uniqueFiles = files.filter((file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`))
    if (referenceImages.length + uniqueFiles.length > MAX_REFERENCE_IMAGES) {
      setGenerationError(t('errors.tooManyFiles', { max: MAX_REFERENCE_IMAGES }))
      setGenerationState('error')
      return
    }
    setReferenceImages((current) => [
      ...current,
      ...uniqueFiles.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        preview: URL.createObjectURL(file),
      })),
    ])
    setGenerationError('')
    setGenerationState('idle')
  }

  const removeReference = (id) => {
    setReferenceImages((current) => {
      const removed = current.find((reference) => reference.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      return current.filter((reference) => reference.id !== id)
    })
  }

  const displayImage = viewMode === 'generated' && generatedUrl ? generatedUrl : item.image

  return (
    <div ref={detailDialogRef} className="detail-backdrop" role="dialog" aria-modal="true" aria-label={t('gallery.viewDetails', { title: item.title })} data-dialog-layer="true" tabIndex={-1}>
      <div className="detail-topbar">
        <button onClick={onClose}><X size={19} /> {t('detail.close')}</button>
        {!isHistoryItem ? <div>
          <IconButton label={t('actions.previous')} onClick={onPrev}><ArrowLeft size={19} /></IconButton>
          <IconButton label={t('actions.next')} onClick={onNext}><ArrowRight size={19} /></IconButton>
        </div> : <span className="detail-history-label"><History size={14} /> GENERATED HISTORY</span>}
      </div>
      <div className="detail-layout">
        <div className="detail-media">
          <button className="detail-image-trigger" onClick={() => setZoomedImage({ src: displayImage, alt: viewMode === 'generated' ? t('history.resultAlt', { title: item.title }) : item.title })} aria-label={t('detail.expand')}>
            <img src={displayImage} alt={viewMode === 'generated' ? t('history.resultAlt', { title: item.title }) : item.title} />
            <span>{t('detail.expand')}</span>
          </button>
          <div className="detail-media-index">GPT—IMAGE—2</div>
          {generatedUrl && !isHistoryItem ? <div className="image-switcher"><button className={viewMode === 'source' ? 'is-active' : ''} onClick={() => setViewMode('source')}>{t('detail.source')}</button><button className={viewMode === 'generated' ? 'is-active' : ''} onClick={() => setViewMode('generated')}>{t('detail.generated')}</button></div> : null}
          {generationState === 'loading' ? <div className="generation-overlay"><LoaderCircle size={23} className="spin" /><span>{t('detail.loading')}</span></div> : null}
        </div>
        <div className="detail-panel">
          <div className="detail-heading">
            <span>{categoryLabel(item.category, language)}</span>
            <h2>{item.title}</h2>
            <p>{t('detail.curatedBy', { author: item.author })}</p>
            {item.promptStatus && item.promptStatus !== 'clean' ? <div className={`prompt-status prompt-status-${item.promptStatus}`}><span />{language === 'zh' ? (PROMPT_STATUS_LABELS_ZH[item.promptStatus] || item.promptStatus.toUpperCase()) : (PROMPT_STATUS_LABELS[item.promptStatus] || item.promptStatus.toUpperCase())}</div> : null}
          </div>

          <div className="prompt-block">
            <div className="prompt-label">
              <span>{t('detail.prompt')}</span>
              <span>{item.prompt.length} {t('detail.chars')}</span>
            </div>
            <textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} aria-label={t('detail.confirmPrompt')} />
          </div>

          {templateVariables.length ? <div className="template-variables">
            <div><span>{t('detail.templateVariables')}</span><p>{t('detail.templateHint')}</p></div>
            <div className="template-variable-grid">
              {templateVariables.map((variable) => <label key={variable.key}><span>{variable.label}</span><input value={templateValues[variable.key] || ''} onChange={(event) => setTemplateValues((current) => ({ ...current, [variable.key]: event.target.value }))} placeholder={variable.defaultValue || variable.label} /></label>)}
            </div>
            <button onClick={applyTemplateVariables} disabled={!templateVariables.some((variable) => templateValues[variable.key]?.trim())}>{t('detail.applyVariables')}</button>
          </div> : null}

          {item.rawPrompt && item.rawPrompt.trim() !== item.prompt.trim() ? <details className="original-prompt">
            <summary>{t('detail.originalPrompt')}</summary>
            <pre>{item.rawPrompt}</pre>
            <button onClick={() => onCopy(item.rawPrompt)}><Copy size={14} />{t('detail.copyOriginal')}</button>
          </details> : null}

          <div className="reference-upload">
            <div className="reference-upload-heading"><span>{t('detail.reference')}</span><span>{referenceImages.length ? t('detail.referenceCount', { count: referenceImages.length }) : t('detail.optional')}</span></div>
            {referenceImages.length ? <div className="reference-preview-grid">
              {referenceImages.map((reference) => (
                <div className="reference-preview" key={reference.id}>
                  <button className="reference-preview-image" onClick={() => setZoomedImage({ src: reference.preview, alt: reference.file.name })} aria-label={`${t('detail.expand')} · ${reference.file.name}`}><img src={reference.preview} alt={reference.file.name} /></button>
                  <span title={reference.file.name}>{reference.file.name}</span>
                  <IconButton label={`${t('detail.referenceRemove')} · ${reference.file.name}`} onClick={() => removeReference(reference.id)}><X size={14} /></IconButton>
                </div>
              ))}
            </div> : null}
            {referenceImages.length < MAX_REFERENCE_IMAGES ? <label className="upload-reference"><Upload size={17} /><span>{referenceImages.length ? t('detail.referenceAdd') : t('detail.referenceUpload')}</span><small>{t('detail.referenceHint')}</small><input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={handleReferenceChange} /></label> : null}
          </div>

          <div className="detail-actions">
            <button className="copy-button" onClick={() => onCopy(promptText)}>
              <Copy size={18} /> {t('detail.copy')}
            </button>
            <button className="generate-button" onClick={requestGeneration} disabled={generationState === 'loading'}>
              {generationState === 'loading' ? <LoaderCircle size={18} className="spin" /> : <Sparkles size={18} />} {t('detail.generate')}
            </button>
            {!isHistoryItem ? <IconButton
              label={favorite ? t('actions.unfavorite') : t('actions.favorite')}
              className={favorite ? 'detail-favorite is-active' : 'detail-favorite'}
              onClick={() => onFavorite(item.id)}
            >
              <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
            </IconButton> : null}
            {!isHistoryItem ? <IconButton label={t('detail.share')} className="detail-share" onClick={onCopyLink}><Share2 size={19} /></IconButton> : null}
          </div>
          {generationState === 'error' ? <div className="generation-error" role="alert">{generationError}<button onClick={onOpenSettings}><Settings2 size={14} />{t('detail.checkSettings')}</button></div> : null}
          {generatedUrl ? <a className="download-link" href={generatedUrl} download="prompt-signal-generated.png" target="_blank" rel="noreferrer"><Download size={16} />{t('detail.download')}</a> : null}

          {isHistoryItem ? <div className="history-detail-meta"><span><Clock3 size={13} /> {formatHistoryDate(item.createdAt, language)}</span><span>{t('detail.historyMeta', { model: item.model || 'IMAGE MODEL', size: item.size || 'auto', quality: item.quality || 'auto' })}</span>{item.referenceName ? <span>{t('history.reference', { name: item.referenceName })}</span> : null}</div> : <div className="source-link">
            <span><i /> {t('detail.source')}</span>
            <div className="source-links">
              {getItemSources(item).map((source) => <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14} /></a>)}
            </div>
          </div>}
        </div>
      </div>
      {confirmOpen ? (
        <div ref={confirmDialogRef} className="generation-confirm-backdrop" role="dialog" aria-modal="true" aria-label={t('detail.confirmTitle')} data-dialog-layer="true" tabIndex={-1}>
          <div className="generation-confirm">
            <div className="generation-confirm-heading"><span>{t('detail.confirmEyebrow')}</span><IconButton label={t('detail.cancelGeneration')} onClick={() => setConfirmOpen(false)}><X size={17} /></IconButton></div>
            <h3>{t('detail.confirmTitle')}</h3>
            <p>{t('detail.confirmCopy')}</p>
            <label className="confirm-prompt-field"><span>{t('detail.confirmPrompt')}</span><textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} /></label>
            {referenceImages.length ? <div className="confirm-reference"><span>{t('detail.reference')} · {referenceImages.length}</span><div className="confirm-reference-grid">{referenceImages.map((reference) => <button key={reference.id} onClick={() => setZoomedImage({ src: reference.preview, alt: reference.file.name })}><img src={reference.preview} alt={reference.file.name} /><div><b>{reference.file.name}</b><small>{t('detail.confirmPreview')}</small></div></button>)}</div></div> : null}
            <div className="generation-confirm-meta"><span>MODEL <b>{config.model}</b></span><span>{t('detail.reference')} <b>{referenceImages.length ? `${t('detail.confirmAttached')} · ${referenceImages.length}` : t('detail.confirmNone')}</b></span></div>
            <div className="generation-confirm-actions"><button className="confirm-cancel" onClick={() => setConfirmOpen(false)}>{t('detail.confirmCancel')}</button><button className="confirm-submit" onClick={() => { setConfirmOpen(false); runGeneration() }}><Sparkles size={17} />{t('detail.confirmSubmit')}</button></div>
          </div>
        </div>
      ) : null}
      {zoomedImage ? <div ref={lightboxDialogRef} className="image-lightbox" role="dialog" aria-modal="true" aria-label={t('detail.preview')} data-dialog-layer="true" tabIndex={-1} onClick={() => setZoomedImage(null)}><button onClick={() => setZoomedImage(null)} aria-label={t('actions.closeSettings')}><X size={22} /></button><img src={zoomedImage.src} alt={zoomedImage.alt} onClick={(event) => event.stopPropagation()} /></div> : null}
    </div>
  )
}

function AppContent() {
  const { t } = useLanguage()
  const [promptCatalog, setPromptCatalog] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState(readFavorites)
  const [selectedId, setSelectedId] = useState(readPromptIdFromLocation)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [toast, setToast] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [apiConfig, setApiConfig] = useState(readApiConfig)
  const [visibleLimit, setVisibleLimit] = useState(GALLERY_PAGE_SIZE)
  const generationHistoryRef = useRef([])
  const pendingGalleryScrollRef = useRef(null)
  const detailOpenedInSessionRef = useRef(false)
  const toastTimerRef = useRef(null)
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())

  useEffect(() => {
    let cancelled = false
    loadPromptCatalog()
      .then((catalog) => {
        if (!cancelled) setPromptCatalog(catalog)
      })
      .catch(() => {
        if (!cancelled) setPromptCatalog([])
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredPrompts = useMemo(() => {
    const matches = []
    promptCatalog.forEach((item) => {
      if (showFavorites && !favorites.has(item.id)) return false
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      const score = deferredSearch ? scorePromptMatch(item, deferredSearch) : 0
      if (score >= 0) matches.push({ item, score })
    })
    if (sort === 'title') matches.sort((first, second) => first.item.title.localeCompare(second.item.title))
    if (sort === 'newest') {
      matches.sort((first, second) => (
        deferredSearch
          ? second.score - first.score || second.item.addedOrder - first.item.addedOrder
          : second.item.addedOrder - first.item.addedOrder
      ))
    }
    return matches.map(({ item }) => item)
  }, [activeCategory, deferredSearch, favorites, promptCatalog, showFavorites, sort])

  useEffect(() => {
    setVisibleLimit(GALLERY_PAGE_SIZE)
  }, [activeCategory, deferredSearch, showFavorites, sort])

  useEffect(() => {
    generationHistoryRef.current = generationHistory
  }, [generationHistory])

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), [])

  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      const legacyRecords = readGenerationHistory()
      try {
        if (legacyRecords.length) {
          await migrateGenerationRecords(legacyRecords, MAX_GENERATION_HISTORY)
          localStorage.removeItem(GENERATION_HISTORY_KEY)
        }
        const records = await loadGenerationRecords(MAX_GENERATION_HISTORY)
        if (cancelled) records.forEach(revokeGenerationRecordAssets)
        else setGenerationHistory(records)
      } catch {
        if (!cancelled) setGenerationHistory(legacyRecords)
      } finally {
        if (!cancelled) setHistoryLoading(false)
      }
    }
    loadHistory()
    return () => {
      cancelled = true
      generationHistoryRef.current.forEach(revokeGenerationRecordAssets)
    }
  }, [])

  const selected = selectedHistory || (selectedId ? promptCatalog.find((item) => item.id === selectedId) : null)

  useEffect(() => {
    if (selectedId || selectedHistory || !pendingGalleryScrollRef.current) return undefined
    const frame = window.requestAnimationFrame(() => {
      const nestedFrame = window.requestAnimationFrame(() => {
        const target = pendingGalleryScrollRef.current
        if (!target) return
        const targetIds = new Set(target.ids)
        const cards = [...document.querySelectorAll('[data-prompt-id]')]
          .filter((element) => targetIds.has(element.dataset.promptId))
          .sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top)
        if (!cards.length) return
        pendingGalleryScrollRef.current = null
        cards[0].scrollIntoView({ block: target.block, behavior: 'instant' })
      })
      pendingGalleryScrollRef.currentFrame = nestedFrame
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(pendingGalleryScrollRef.currentFrame)
    }
  }, [selectedHistory, selectedId, visibleLimit])

  useEffect(() => {
    if (catalogLoading || !selectedId || selectedHistory) return
    if (!promptCatalog.some((item) => item.id === selectedId)) {
      updatePromptUrl(null)
      setSelectedId(null)
    }
  }, [catalogLoading, promptCatalog, selectedHistory, selectedId])

  useEffect(() => {
    const onPopState = () => {
      const promptId = readPromptIdFromLocation()
      setSelectedHistory(null)
      setSelectedId(promptId)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const persistFavorites = (next) => {
    setFavorites(next)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
  }

  const toggleFavorite = (id) => {
    const next = new Set(favorites)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    persistFavorites(next)
  }

  const openPrompt = (item) => {
    detailOpenedInSessionRef.current = true
    updatePromptUrl(item.id, 'push')
    setSelectedHistory(null)
    setSelectedId(item.id)
  }

  const closeDetail = () => {
    setSelectedHistory(null)
    if (!selectedId) return

    if (detailOpenedInSessionRef.current && window.history.state?.promptSignalDetail) {
      const selectedIndex = filteredPrompts.findIndex((item) => item.id === selectedId)
      if (selectedIndex >= 0) {
        pendingGalleryScrollRef.current = { ids: [selectedId], block: 'center' }
        const requiredLimit = Math.ceil((selectedIndex + 1) / GALLERY_PAGE_SIZE) * GALLERY_PAGE_SIZE
        setVisibleLimit((current) => Math.max(current, requiredLimit))
      }
      detailOpenedInSessionRef.current = false
      window.history.back()
      return
    }

    detailOpenedInSessionRef.current = false
    pendingGalleryScrollRef.current = null
    updatePromptUrl(null)
    setSelectedId(null)
    setVisibleLimit(GALLERY_PAGE_SIZE)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }))
  }

  const navigateDetail = (direction) => {
    if (!selectedId || selectedHistory) return
    const index = filteredPrompts.findIndex((item) => item.id === selectedId)
    if (index < 0 || !filteredPrompts.length) return
    const nextIndex = (index + direction + filteredPrompts.length) % filteredPrompts.length
    const nextId = filteredPrompts[nextIndex].id
    updatePromptUrl(nextId)
    setSelectedId(nextId)
  }

  const loadMorePrompts = () => {
    const firstLayer = filteredPrompts
      .slice(visibleLimit, visibleLimit + getGalleryColumnCount())
      .map((item) => item.id)
    if (firstLayer.length) pendingGalleryScrollRef.current = { ids: firstLayer, block: 'start' }
    setVisibleLimit((limit) => limit + GALLERY_PAGE_SIZE)
  }

  const showToast = (message) => {
    window.clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800)
  }

  const copyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const helper = document.createElement('textarea')
      helper.value = prompt
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
    }
    showToast(t('toast.copied'))
  }

  const copyPromptLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      const helper = document.createElement('textarea')
      helper.value = window.location.href
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
    }
    showToast(t('toast.linkCopied'))
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('all')
    setShowFavorites(false)
  }

  const saveApiConfig = () => {
    localStorage.setItem(IMAGE_API_CONFIG_KEY, JSON.stringify(apiConfig))
    setSettingsOpen(false)
    showToast(t('toast.settingsSaved'))
  }

  const clearApiConfig = () => {
    localStorage.removeItem(IMAGE_API_CONFIG_KEY)
    setApiConfig(DEFAULT_API_CONFIG)
  }

  const saveGeneration = async (record) => {
    try {
      const saved = await saveGenerationRecord(record, MAX_GENERATION_HISTORY)
      setGenerationHistory((current) => {
        const next = [saved, ...current.filter((item) => item.id !== saved.id)].slice(0, MAX_GENERATION_HISTORY)
        current.filter((item) => !next.includes(item)).forEach(revokeGenerationRecordAssets)
        return next
      })
    } catch {
      setGenerationHistory((current) => writeGenerationHistory([record, ...current]))
    }
  }

  const clearGenerationHistory = async () => {
    try {
      await clearGenerationRecords()
    } catch {
      // The localStorage fallback below still clears history when IndexedDB is unavailable.
    }
    localStorage.removeItem(GENERATION_HISTORY_KEY)
    setGenerationHistory((current) => {
      current.forEach(revokeGenerationRecordAssets)
      return []
    })
  }

  const removeGenerationHistory = async (record) => {
    try {
      await deleteGenerationRecord(record.id)
    } catch {
      const next = generationHistory.filter((item) => item.id !== record.id)
      writeGenerationHistory(next)
    }
    revokeGenerationRecordAssets(record)
    setGenerationHistory((current) => current.filter((item) => item.id !== record.id))
  }

  const openHistoryRecord = (record) => {
    setHistoryOpen(false)
    setSelectedId(null)
    setSelectedHistory({
      ...record,
      id: `history-${record.id}`,
      kind: 'generation-history',
      generatedUrl: record.image,
      author: record.model || 'IMAGE MODEL',
      sourceLabel: 'GENERATED',
      sources: [],
    })
  }

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
        favoriteCount={favorites.size}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        historyCount={generationHistory.length}
        onHistory={() => setHistoryOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />
      <main>
        <Intro count={catalogLoading ? null : promptCatalog.length} />
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          resultCount={filteredPrompts.length}
          loading={catalogLoading}
          searchActive={Boolean(deferredSearch)}
          sort={sort}
          setSort={setSort}
        />
        {catalogLoading ? <CatalogSkeleton /> : filteredPrompts.length ? (
          <>
            <MasonryGallery
              items={filteredPrompts.slice(0, visibleLimit)}
              favoriteIds={favorites}
              onOpen={openPrompt}
              onFavorite={toggleFavorite}
            />
            {visibleLimit < filteredPrompts.length ? <div className="load-more-wrap"><button className="load-more" onClick={loadMorePrompts}>{t('loadMore.button')} <ArrowDown size={17} /></button><span>{t('loadMore.status', { shown: Math.min(visibleLimit, filteredPrompts.length), total: filteredPrompts.length })}</span></div> : null}
          </>
        ) : (
          <EmptyState showFavorites={showFavorites} clearFilters={clearFilters} />
        )}
      </main>
      <footer>
        <div>
          <Sparkles size={18} />
          <strong>PROMPT/SIGNAL</strong>
        </div>
        <p>{t('footer')}</p>
      </footer>

      {selected ? (
        <DetailView
          item={selected}
          favorite={!selectedHistory && favorites.has(selected.id)}
          onFavorite={toggleFavorite}
          onClose={closeDetail}
          onPrev={() => navigateDetail(-1)}
          onNext={() => navigateDetail(1)}
          onCopy={copyPrompt}
          onCopyLink={copyPromptLink}
          config={apiConfig}
          onOpenSettings={() => setSettingsOpen(true)}
          onGenerationComplete={saveGeneration}
        />
      ) : null}

      {historyOpen ? <HistoryPanel records={generationHistory} loading={historyLoading} onOpen={openHistoryRecord} onDelete={removeGenerationHistory} onClear={clearGenerationHistory} onClose={() => setHistoryOpen(false)} /> : null}
      {settingsOpen ? <SettingsPanel config={apiConfig} onChange={(patch) => setApiConfig((current) => ({ ...current, ...patch }))} onSave={saveApiConfig} onClear={clearApiConfig} onClose={() => setSettingsOpen(false)} /> : null}

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status">
        <Check size={17} /> {toast}
      </div>
    </>
  )
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>
}
