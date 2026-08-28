import { createContext, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
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
  Plus,
  RotateCcw,
  Upload,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Sun,
  Moon,
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
const THEME_KEY = 'prompt-signal:theme:v1'
const FAVORITES_KEY = 'prompt-signal:favorites:v1'
const IMAGE_API_CONFIG_KEY = 'prompt-signal:image-api:v1'
const IMAGE_API_CONFIG_VERSION = 2
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

const API_PROTOCOLS = new Set(['images', 'generate-content'])
const API_SIZES = new Set(['auto', '1024x1024', '1536x1024', '1024x1536', '1792x1024', '1024x1792'])
const API_QUALITIES = new Set(['auto', 'standard', 'hd', 'low', 'medium', 'high'])
const REFERENCE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

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
    'actions.create': 'Create image',
    'actions.settings': 'Image model settings',
    'actions.settingsShort': 'Models',
    'actions.language': 'Switch to Chinese',
    'actions.themeToLight': 'Switch to light mode',
    'actions.themeToDark': 'Switch to dark mode',
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
    'settings.note': 'Save multiple image model connections in this browser, then switch the active one whenever you generate. Changes apply only after saving. Test connection only sends a validation request; it never generates an image.',
    'settings.profile': 'ACTIVE CONFIGURATION',
    'settings.profileName': 'CONFIGURATION NAME',
    'settings.defaultProfileName': 'Model {{index}}',
    'settings.addProfile': 'Add configuration',
    'settings.deleteProfile': 'Delete configuration',
    'settings.deleteDisabled': 'Keep at least one configuration',
    'settings.profileCount': '{{count}} configurations saved in this session',
    'settings.notConfigured': 'Not configured',
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
    'settings.security': 'Stored locally in this browser · never uploaded to Prompt Signal',
    'settings.testConnection': 'Test connection',
    'settings.testingConnection': 'Testing connection…',
    'settings.connectionReady': 'Endpoint responded · configuration looks reachable',
    'settings.connectionReachable': 'Endpoint responded · verify the model before generating',
    'settings.connectionRateLimited': 'Endpoint and credentials responded · request rate limited',
    'settings.connectionUnverified': 'The endpoint could not complete a non-generating check · this does not mean the configuration is invalid',
    'settings.connectionServerUnverified': 'The endpoint responded, but rejected the validation payload · try a real generation to confirm the model',
    'settings.connectionUnauthorized': 'Authentication failed · check the API key',
    'settings.connectionNotFound': 'Endpoint or model not found · check the URL',
    'settings.connectionServer': 'The endpoint returned a server error',
    'settings.connectionRejected': 'Request rejected (HTTP {{status}})',
    'settings.connectionFailed': 'Could not reach the endpoint · check URL and CORS',
    'settings.connectionMissing': 'Enter an API URL, API key, and model first',
    'settings.connectionTimeout': 'Connection timed out · check the endpoint',
    'settings.connectionInvalidUrl': 'Enter a valid absolute API URL',
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
    'detail.previousImage': 'Previous image',
    'detail.nextImage': 'Next image',
    'detail.imageCount': 'Image {{current}} of {{total}}',
    'detail.curatedBy': 'CURATED BY {{author}}',
    'detail.prompt': 'PROMPT',
    'detail.restoreOriginal': 'Restore original prompt',
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
    'detail.imageEngine': 'IMAGE MODEL',
    'detail.outputSettings': 'OUTPUT SETTINGS',
    'detail.size': 'SIZE',
    'detail.quality': 'QUALITY',
    'detail.editModels': 'Manage model configurations',
    'detail.checkSettings': 'Check settings',
    'detail.download': 'Download generated result',
    'detail.historyLabel': 'GENERATED HISTORY',
    'detail.historyMeta': '{{model}} · {{size}} · {{quality}}',
    'detail.loading': 'Rendering image…',
    'detail.preparingImages': 'Optimizing reference images…',
    'detail.confirmEyebrow': 'READY TO RENDER',
    'detail.confirmTitle': 'Generate this image?',
    'detail.confirmCopy': 'After confirmation, this edited prompt will be sent with the selected model and reference images.',
    'detail.confirmPrompt': 'PROMPT · EDIT AGAIN BEFORE GENERATING',
    'detail.confirmPreview': 'Click thumbnail to enlarge',
    'detail.confirmAttached': 'ATTACHED',
    'detail.confirmNone': 'NONE',
    'detail.confirmCancel': 'Cancel',
    'detail.confirmSubmit': 'Confirm generation',
    'detail.cancelGeneration': 'Cancel generation',
    'detail.preview': 'Image preview',
    'custom.eyebrow': 'CUSTOM STUDIO',
    'custom.title': 'Create your own image',
    'custom.topbar': 'CUSTOM GENERATION',
    'custom.mediaEmpty': 'Your generated image will appear here',
    'custom.promptPlaceholder': 'Describe the image you want to create...',
    'errors.fetch': 'Could not reach the endpoint. Check the URL, CORS, or network settings.',
    'errors.request': 'Request failed (HTTP {{status}}).',
    'errors.imageResponse': 'The endpoint returned no image URL or b64_json.',
    'errors.invalidFile': 'Choose a PNG, JPEG, or WEBP image file.',
    'errors.tooManyFiles': 'You can attach up to {{max}} reference images.',
    'errors.fileRead': 'A reference image could not be read.',
    'errors.imageOptimize': 'A reference image could not be losslessly optimized.',
    'errors.promptRequired': 'Enter a prompt before generating.',
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
    'actions.create': '自由创作',
    'actions.settings': '图片模型配置',
    'actions.settingsShort': '模型',
    'actions.language': '切换为英文',
    'actions.themeToLight': '切换到日间模式',
    'actions.themeToDark': '切换到夜间模式',
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
    'settings.note': '可以在当前浏览器保存多个图片模型配置，并在每次生成前随时切换当前使用的配置。所有修改仅在保存后生效。测试连接只发送参数校验请求，不会生成图片。',
    'settings.profile': '当前配置',
    'settings.profileName': '配置名称',
    'settings.defaultProfileName': '模型 {{index}}',
    'settings.addProfile': '添加配置',
    'settings.deleteProfile': '删除配置',
    'settings.deleteDisabled': '至少保留一个配置',
    'settings.profileCount': '当前会话中共有 {{count}} 个配置',
    'settings.notConfigured': '未配置',
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
    'settings.security': '浏览器本地保存 · 不会上传到 Prompt Signal',
    'settings.testConnection': '测试连接',
    'settings.testingConnection': '正在测试连接…',
    'settings.connectionReady': '接口已响应 · 配置看起来可以访问',
    'settings.connectionReachable': '接口已响应 · 生成前请确认模型名称',
    'settings.connectionRateLimited': '接口和鉴权已响应 · 当前请求受到限流',
    'settings.connectionUnverified': '无法完成无副作用的校验 · 这不代表配置不可用',
    'settings.connectionServerUnverified': '接口已响应，但拒绝了校验参数 · 请通过一次实际生成确认模型',
    'settings.connectionUnauthorized': '鉴权失败 · 请检查 API Key',
    'settings.connectionNotFound': '接口或模型不存在 · 请检查 URL',
    'settings.connectionServer': '接口返回了服务器错误',
    'settings.connectionRejected': '请求被接口拒绝（HTTP {{status}}）',
    'settings.connectionFailed': '无法连接接口 · 请检查 URL 和 CORS',
    'settings.connectionMissing': '请先填写 API URL、API Key 和模型名',
    'settings.connectionTimeout': '连接超时 · 请检查接口地址',
    'settings.connectionInvalidUrl': '请输入有效的完整 API URL',
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
    'detail.previousImage': '上一张图片',
    'detail.nextImage': '下一张图片',
    'detail.imageCount': '第 {{current}} / {{total}} 张',
    'detail.curatedBy': 'CURATED BY {{author}}',
    'detail.prompt': 'PROMPT',
    'detail.restoreOriginal': '恢复原始 Prompt',
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
    'detail.imageEngine': '图片模型',
    'detail.outputSettings': '本次生成参数',
    'detail.size': '尺寸',
    'detail.quality': '质量',
    'detail.editModels': '管理模型配置',
    'detail.checkSettings': '检查配置',
    'detail.download': '下载生成结果',
    'detail.historyLabel': 'GENERATED HISTORY',
    'detail.historyMeta': '{{model}} · {{size}} · {{quality}}',
    'detail.loading': '正在生成图像…',
    'detail.preparingImages': '正在无损压缩参考图片…',
    'detail.confirmEyebrow': 'READY TO RENDER',
    'detail.confirmTitle': '确认生成这张图片？',
    'detail.confirmCopy': '确认后将使用所选模型和参考图发送当前编辑后的 Prompt。',
    'detail.confirmPrompt': 'PROMPT · 可在这里二次编辑',
    'detail.confirmPreview': '点击缩略图放大预览',
    'detail.confirmAttached': '已附加',
    'detail.confirmNone': '无',
    'detail.confirmCancel': '取消',
    'detail.confirmSubmit': '确认生成',
    'detail.cancelGeneration': '取消生成',
    'detail.preview': '图片预览',
    'custom.eyebrow': '自由创作',
    'custom.title': '生成自定义图片',
    'custom.topbar': '自定义生成',
    'custom.mediaEmpty': '生成结果会显示在这里',
    'custom.promptPlaceholder': '描述你想要生成的图片...',
    'errors.fetch': '无法连接接口。请检查 URL、CORS 或网络设置。',
    'errors.request': '请求失败（HTTP {{status}}）。',
    'errors.imageResponse': '接口没有返回图片 URL 或 b64_json。',
    'errors.invalidFile': '请选择 PNG、JPEG 或 WEBP 图片文件。',
    'errors.tooManyFiles': '最多可以附加 {{max}} 张参考图片。',
    'errors.fileRead': '无法读取其中一张参考图片。',
    'errors.imageOptimize': '其中一张参考图片无法完成无损压缩。',
    'errors.promptRequired': '请先填写 Prompt 再生成。',
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

const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Private browsing may disable localStorage; the theme still works for this session.
    }
  }, [theme])

  const toggleTheme = () => setTheme((value) => value === 'dark' ? 'light' : 'dark')
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return useContext(ThemeContext)
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

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not losslessly optimize reference image'))
    }, 'image/png')
  })
}

async function decodeReferenceImage(file) {
  if (typeof createImageBitmap === 'function') {
    let bitmap
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      bitmap = await createImageBitmap(file)
    }
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: (context) => context.drawImage(bitmap, 0, 0),
      close: () => bitmap.close(),
    }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      draw: (context) => context.drawImage(image, 0, 0),
      close: () => URL.revokeObjectURL(objectUrl),
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function losslesslyOptimizeReferenceImage(file) {
  let source
  try {
    source = await decodeReferenceImage(file)
  } catch (error) {
    throw new Error('Could not losslessly optimize reference image', { cause: error })
  }
  try {
    const canvas = document.createElement('canvas')
    canvas.width = source.width
    canvas.height = source.height
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('Could not losslessly optimize reference image')
    source.draw(context)

    const optimizedBlob = await canvasToPngBlob(canvas)
    if (optimizedBlob.size >= file.size) return file
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'reference-image'
    return new File([optimizedBlob], `${baseName}.png`, {
      type: 'image/png',
      lastModified: file.lastModified,
    })
  } finally {
    source.close()
  }
}

async function losslesslyOptimizeReferenceImages(files) {
  const optimized = []
  // Process sequentially so several high-resolution references do not hold decoded bitmaps at once.
  for (const file of files) optimized.push(await losslesslyOptimizeReferenceImage(file))
  return optimized
}

function imageConfigForSize(size) {
  const aspectRatio = {
    '1024x1024': '1:1',
    '1536x1024': '3:2',
    '1024x1536': '2:3',
    '1792x1024': '16:9',
    '1024x1792': '9:16',
  }[size]
  return aspectRatio ? { aspectRatio } : null
}

function extractGeneratedImage(payload) {
  const imageOutput = payload?.data?.[0] || payload?.images?.[0]
  if (imageOutput?.url) return imageOutput.url
  if (imageOutput?.b64_json) return `data:image/png;base64,${imageOutput.b64_json}`

  const parts = (payload?.candidates || []).flatMap((candidate) => candidate?.content?.parts || [])
  const inlineImage = parts
    .map((part) => part?.inlineData || part?.inline_data)
    .find((inlineData) => inlineData?.data)
  if (!inlineImage) return ''
  return `data:${inlineImage.mimeType || inlineImage.mime_type || 'image/png'};base64,${inlineImage.data}`
}

async function generateImageRequest({ config, prompt, referenceFiles, t, language }) {
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
    const resolvedSize = config.size
    const resolvedQuality = config.quality

    if (referenceFiles.length) {
      endpoint = endpoint.replace(/\/generations\/?$/, '/edits')
      body = new FormData()
      const imageField = referenceFiles.length > 1 ? 'image[]' : 'image'
      referenceFiles.forEach((file) => body.append(imageField, file))
      body.append('model', config.model.trim())
      body.append('prompt', prompt)
      body.append('size', resolvedSize)
      body.append('quality', resolvedQuality)
      body.append('n', '1')
    } else {
      headers['Content-Type'] = 'application/json'
      const payloadData = {
        model: config.model.trim(),
        prompt,
        size: resolvedSize,
        n: 1,
      }
      payloadData.quality = resolvedQuality
      body = JSON.stringify(payloadData)
    }
  }

  const response = await fetch(endpoint, { method: 'POST', headers, body })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    let errorMsg = payload?.error?.message || payload?.message || payload?.error || ''
    if (typeof errorMsg !== 'string') errorMsg = JSON.stringify(errorMsg)
    if (!errorMsg) errorMsg = t('errors.request', { status: response.status })

    if (/unknown error/i.test(errorMsg) || payload?.code === 50507) {
      errorMsg = language === 'zh'
        ? `${errorMsg} (建议排查: 检查 SIZE 是否需指定为具体尺寸如 1024x1024，或核对模型名与接口兼容性)`
        : `${errorMsg} (Hint: Check if provider requires explicit SIZE like 1024x1024, or verify model compatibility)`
    }
    throw new Error(errorMsg)
  }
  const generatedImage = extractGeneratedImage(payload)
  if (!generatedImage) throw new Error(t('errors.imageResponse'))
  return generatedImage
}

async function testImageModelConnection({ config, t }) {
  const endpointValue = config.endpoint.trim()
  const apiKey = config.apiKey.trim()
  const model = config.model.trim()
  if (!endpointValue || !apiKey || !model) throw new Error(t('settings.connectionMissing'))

  const isGenerateContent = config.protocol === 'generate-content'
  const endpoint = isGenerateContent ? resolveGenerateContentEndpoint(endpointValue, model) : endpointValue
  try {
    new URL(endpoint)
  } catch {
    throw new Error(t('settings.connectionInvalidUrl'))
  }
  const headers = isGenerateContent
    ? { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }
    : { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  // Deliberately send an invalid, non-generating payload. A 4xx validation response
  // proves that the route and credentials are reachable without spending a generation.
  const body = isGenerateContent
    ? JSON.stringify({ contents: [] })
    : JSON.stringify({ model, prompt: null })
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)
  const fail = (message) => {
    const error = new Error(message)
    error.connectionTest = true
    throw error
  }

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body, cache: 'no-store', signal: controller.signal })
    if (response.status === 401 || response.status === 403) fail(t('settings.connectionUnauthorized'))
    if (response.status === 404) fail(t('settings.connectionNotFound'))
    if (response.status >= 500) return { state: 'warning', message: t('settings.connectionServerUnverified') }
    if (response.status === 429) return { state: 'success', message: t('settings.connectionRateLimited') }
    if (response.status === 405) return { state: 'warning', message: t('settings.connectionUnverified') }
    if (response.status === 400 || response.status === 415 || response.status === 422) return { state: 'success', message: t('settings.connectionReachable') }
    if (!response.ok) {
      const raw = await response.text().catch(() => '')
      let detail = ''
      try {
        const payload = raw ? JSON.parse(raw) : null
        detail = payload?.error?.message || payload?.message || ''
      } catch {
        detail = raw.trim()
      }
      const suffix = typeof detail === 'string' && detail ? ` · ${detail}` : ''
      fail(`${t('settings.connectionRejected', { status: response.status })}${suffix}`)
    }
    return { state: 'success', message: t('settings.connectionReady') }
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(t('settings.connectionTimeout'))
    if (error?.connectionTest) throw error
    return { state: 'warning', message: t('settings.connectionUnverified') }
  } finally {
    window.clearTimeout(timeout)
  }
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

function createApiProfile(index = 0, overrides = {}) {
  const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `model-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id: String(overrides.id || generatedId),
    name: String(overrides.name || `Model ${index + 1}`),
    protocol: API_PROTOCOLS.has(overrides.protocol) ? overrides.protocol : DEFAULT_API_CONFIG.protocol,
    endpoint: typeof overrides.endpoint === 'string' ? overrides.endpoint : '',
    apiKey: typeof overrides.apiKey === 'string' ? overrides.apiKey : '',
    model: typeof overrides.model === 'string' ? overrides.model : '',
    size: API_SIZES.has(overrides.size) ? overrides.size : DEFAULT_API_CONFIG.size,
    quality: API_QUALITIES.has(overrides.quality) ? overrides.quality : DEFAULT_API_CONFIG.quality,
  }
}

function createApiConfigStore(profileOverrides = {}) {
  const profile = createApiProfile(0, profileOverrides)
  return { version: IMAGE_API_CONFIG_VERSION, activeId: profile.id, profiles: [profile] }
}

function normalizeApiConfigStore(stored) {
  if (!Array.isArray(stored?.profiles) || !stored.profiles.length) return null
  const usedIds = new Set()
  const profiles = stored.profiles.map((profile, index) => {
    const normalized = createApiProfile(index, profile)
    while (usedIds.has(normalized.id)) normalized.id = `${normalized.id}-${index + 1}`
    usedIds.add(normalized.id)
    return normalized
  })
  const activeId = usedIds.has(String(stored.activeId)) ? String(stored.activeId) : profiles[0].id
  return { version: IMAGE_API_CONFIG_VERSION, activeId, profiles }
}

function readApiConfigStore() {
  try {
    const stored = JSON.parse(localStorage.getItem(IMAGE_API_CONFIG_KEY) || '{}')
    const normalizedStore = normalizeApiConfigStore(stored)
    if (normalizedStore) return normalizedStore
    // Clear the old built-in OpenAI defaults so a first-time setup starts blank.
    if (stored.endpoint === 'https://api.openai.com/v1/images/generations' && !stored.apiKey) {
      return createApiConfigStore()
    }
    const hasLegacyConfig = ['endpoint', 'apiKey', 'model'].some((key) => typeof stored[key] === 'string' && stored[key])
    return createApiConfigStore(hasLegacyConfig ? stored : {})
  } catch {
    return createApiConfigStore()
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

function Header({ search, setSearch, favoriteCount, showFavorites, onToggleFavorites, historyCount, onCreate, onHistory, onSettings }) {
  const [mobileSearch, setMobileSearch] = useState(false)
  const { language, t, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

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
        <button className="create-button" onClick={onCreate} aria-label={t('actions.create')} title={t('actions.create')}>
          <Sparkles size={18} />
          <span>{t('actions.create')}</span>
        </button>
        <div className="header-library-actions" aria-label={`${t('actions.favorites')} / ${t('actions.history')}`}>
          <button
            className={`favorites-button ${showFavorites ? 'is-active' : ''}`}
            onClick={onToggleFavorites}
            aria-pressed={showFavorites}
            aria-label={t('actions.favorites')}
            title={t('actions.favorites')}
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
        </div>
        <button className="header-settings-button" onClick={onSettings} aria-label={t('actions.settings')} title={t('actions.settings')}>
          <Settings2 size={18} />
          <span>{t('actions.settingsShort')}</span>
        </button>
        <IconButton label={theme === 'dark' ? t('actions.themeToLight') : t('actions.themeToDark')} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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

function SettingsPanel({ config, profiles, activeId, onChange, onSelect, onAdd, onRemove, onSave, onClose, onTestConnection }) {
  const [showKey, setShowKey] = useState(false)
  const [testState, setTestState] = useState({ state: 'idle', message: '' })
  const testStatusRef = useRef(null)
  const { t } = useLanguage()
  const dialogRef = useDialogFocus(true, onClose)

  useEffect(() => {
    setTestState({ state: 'idle', message: '' })
  }, [config.endpoint, config.apiKey, config.model, config.protocol])

  useEffect(() => {
    if (!testState.message) return
    const frame = window.requestAnimationFrame(() => {
      testStatusRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [testState.message])

  const handleTestConnection = async () => {
    setTestState({ state: 'loading', message: '' })
    try {
      const result = await onTestConnection(config)
      setTestState(result)
    } catch (error) {
      setTestState({ state: 'error', message: error?.message || t('settings.connectionFailed') })
    }
  }

  return (
    <div ref={dialogRef} className="settings-backdrop" role="dialog" aria-modal="true" aria-label={t('settings.title')} data-dialog-layer="true" tabIndex={-1}>
      <div className="settings-panel">
        <div className="settings-heading">
          <div><span>{t('settings.eyebrow')}</span><h2>{t('settings.title')}</h2></div>
          <IconButton label={t('actions.closeSettings')} onClick={onClose}><X size={19} /></IconButton>
        </div>
        <p className="settings-note">{t('settings.note')}</p>
        <div className="settings-profile-toolbar">
          <label className="settings-profile-picker">
            <span>{t('settings.profile')}</span>
            <span className="settings-profile-select">
              <select value={activeId} onChange={(event) => onSelect(event.target.value)}>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </span>
          </label>
          <IconButton className="settings-profile-action" label={t('settings.addProfile')} onClick={() => onAdd(t('settings.defaultProfileName', { index: profiles.length + 1 }))}><Plus size={18} /></IconButton>
          <IconButton className="settings-profile-action settings-profile-delete" label={profiles.length === 1 ? t('settings.deleteDisabled') : t('settings.deleteProfile')} onClick={onRemove} disabled={profiles.length === 1}><Trash2 size={17} /></IconButton>
        </div>
        <div className="settings-profile-meta">{t('settings.profileCount', { count: profiles.length })}</div>
        <label className="settings-field"><span>{t('settings.profileName')}</span><input value={config.name} onChange={(event) => onChange({ name: event.target.value })} placeholder={t('settings.defaultProfileName', { index: profiles.findIndex((profile) => profile.id === activeId) + 1 })} /></label>
        <label className="settings-field"><span>{t('settings.protocol')}</span><span className="settings-select-wrap"><select value={config.protocol} onChange={(e) => onChange({ protocol: e.target.value })}><option value="images">{t('settings.protocolImages')}</option><option value="generate-content">{t('settings.protocolGenerateContent')}</option></select><ChevronDown size={15} aria-hidden="true" /></span></label>
        <label className="settings-field"><span>{t('settings.apiUrl')}</span><input value={config.endpoint} onChange={(e) => onChange({ endpoint: e.target.value })} placeholder={config.protocol === 'generate-content' ? t('settings.generateContentPlaceholder') : t('settings.endpointPlaceholder')} /></label>
        <label className="settings-field"><span>{t('settings.apiKey')}</span><div className="key-input"><input type={showKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => onChange({ apiKey: e.target.value })} placeholder="your-api-key" autoComplete="off" /><IconButton label={showKey ? t('actions.hideKey') : t('actions.showKey')} onClick={() => setShowKey((v) => !v)}>{showKey ? <EyeOff size={17} /> : <Eye size={17} />}</IconButton></div></label>
        <div className={`settings-grid ${config.protocol === 'generate-content' ? 'is-generate-content' : ''}`}>
          <label className="settings-field"><span>{t('settings.model')}</span><input value={config.model} onChange={(e) => onChange({ model: e.target.value })} placeholder={config.protocol === 'generate-content' ? 'e.g. gemini-3.1-flash-image' : t('settings.modelPlaceholder')} /></label>
          <label className="settings-field">
            <span>SIZE</span>
            <span className="settings-select-wrap"><select value={config.size} onChange={(e) => onChange({ size: e.target.value })}>
              <option value="auto">auto</option>
              <option value="1024x1024">1024x1024 (1:1)</option>
              <option value="1536x1024">1536x1024 (3:2)</option>
              <option value="1024x1536">1024x1536 (2:3)</option>
              <option value="1792x1024">1792x1024 (16:9)</option>
              <option value="1024x1792">1024x1792 (9:16)</option>
            </select><ChevronDown size={15} aria-hidden="true" /></span>
          </label>
          {config.protocol === 'images' ? (
            <label className="settings-field">
              <span>QUALITY</span>
              <span className="settings-select-wrap"><select value={config.quality} onChange={(e) => onChange({ quality: e.target.value })}>
                <option value="auto">auto</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="standard">standard</option>
                <option value="hd">hd</option>
              </select><ChevronDown size={15} aria-hidden="true" /></span>
            </label>
          ) : null}
        </div>
        <div className="settings-actions"><button className="settings-save" onClick={onSave}><Check size={17} />{t('settings.save')}</button><button className="settings-test" onClick={handleTestConnection} disabled={testState.state === 'loading'}>{testState.state === 'loading' ? <LoaderCircle size={16} className="spin" /> : <Check size={16} />}{testState.state === 'loading' ? t('settings.testingConnection') : t('settings.testConnection')}</button></div>
        {testState.message ? <div ref={testStatusRef} className={`settings-test-status is-${testState.state}`} role={testState.state === 'error' ? 'alert' : 'status'}>{testState.state === 'success' ? <Check size={14} /> : testState.state === 'warning' ? <CircleAlert size={14} /> : <X size={14} />}{testState.message}</div> : null}
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

function GalleryCard({ item, index, favorite, onOpen, onFavorite }) {
  const [imageState, setImageState] = useState('loading')
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const { language, t } = useLanguage()

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    setImageState(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [item.image])

  const imageAspect = item.width && item.height ? `${item.width} / ${item.height}` : undefined

  return (
    <article ref={cardRef} className={`gallery-card ratio-${item.ratio}`} data-prompt-id={item.id} style={{ '--delay': `${Math.min(index % 12, 11) * 35}ms` }}>
      <button
        className={`card-image is-${imageState}`}
        style={imageAspect ? { aspectRatio: imageAspect } : undefined}
        onClick={() => onOpen(item)}
        aria-label={t('gallery.viewDetails', { title: item.title })}
        aria-busy={imageState === 'loading'}
      >
        <span className="image-skeleton" aria-hidden="true" />
        {imageState === 'error' ? <span className="image-fallback">{t('gallery.unavailable')}</span> : null}
        <img
          ref={imageRef}
          src={item.image}
          alt={item.title}
          loading={index > 8 ? 'lazy' : 'eager'}
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('error')}
        />
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

function getCardWeight(item) {
  const imgRatio = item.width && item.height ? item.height / item.width : 1.34
  const titleLines = Math.ceil(String(item.title || '').length / 20)
  return imgRatio + titleLines * 0.08 + 0.2
}

function MasonryGallery({ items, favoriteIds, onOpen, onFavorite }) {
  const [columnCount, setColumnCount] = useState(getGalleryColumnCount)

  useEffect(() => {
    const handleResize = () => setColumnCount(getGalleryColumnCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const columns = useMemo(() => {
    const nextColumns = Array.from({ length: columnCount }, () => [])
    const heights = Array.from({ length: columnCount }, () => 0)

    items.forEach((item, index) => {
      let minCol = 0
      for (let c = 1; c < columnCount; c++) {
        if (heights[c] < heights[minCol]) minCol = c
      }
      nextColumns[minCol].push({ item, index })
      heights[minCol] += getCardWeight(item)
    })

    return nextColumns
  }, [columnCount, items])

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

function DetailView({ item, favorite, onFavorite, onClose, onPrev, onNext, onCopy, onCopyLink, config, profiles, onSelectConfig, onOpenSettings, onGenerationComplete }) {
  const isHistoryItem = item.kind === 'generation-history'
  const isCustomItem = item.kind === 'custom-generation'
  const { language, t } = useLanguage()
  const [promptText, setPromptText] = useState(item.prompt)
  const [generatedUrl, setGeneratedUrl] = useState(item.generatedUrl || '')
  const [viewMode, setViewMode] = useState(item.generatedUrl ? 'generated' : 'source')
  const [sourceImageIndex, setSourceImageIndex] = useState(0)
  const [generationState, setGenerationState] = useState('idle')
  const [generationError, setGenerationError] = useState('')
  const [generationSetupOpen, setGenerationSetupOpen] = useState(false)
  const [generationOptions, setGenerationOptions] = useState(() => ({ size: config.size, quality: config.quality }))
  const [referenceImages, setReferenceImages] = useState([])
  const [zoomedImage, setZoomedImage] = useState(null)
  const [templateValues, setTemplateValues] = useState(() => createTemplateValues(item.promptVariables))
  const referenceImagesRef = useRef([])
  const appliedTemplateValuesRef = useRef({})
  const detailDialogRef = useDialogFocus(true, onClose)
  const setupDialogRef = useDialogFocus(generationSetupOpen, () => setGenerationSetupOpen(false))
  const lightboxDialogRef = useDialogFocus(Boolean(zoomedImage), () => setZoomedImage(null))

  useEffect(() => {
    setPromptText(item.prompt)
    setGeneratedUrl(item.generatedUrl || '')
    setViewMode(item.generatedUrl ? 'generated' : 'source')
    setSourceImageIndex(0)
    setGenerationState('idle')
    setGenerationError('')
    setGenerationSetupOpen(false)
    setGenerationOptions({ size: config.size, quality: config.quality })
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
  const originalPrompt = item.rawPrompt?.trim() || item.prompt
  const canRestorePrompt = Boolean(originalPrompt && promptText !== originalPrompt)

  const applyTemplateVariables = () => {
    const previousValues = appliedTemplateValuesRef.current
    setPromptText((current) => applyPromptVariables(current, templateVariables, templateValues, previousValues))
    appliedTemplateValuesRef.current = { ...templateValues }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const dialogs = [...document.querySelectorAll('[data-dialog-layer="true"]')]
      if (dialogs.at(-1) !== detailDialogRef.current || isCustomItem || isEditableTarget(event.target)) return
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
  }, [detailDialogRef, isCustomItem, onNext, onPrev])

  const runGeneration = async () => {
    if (!promptText.trim()) {
      setGenerationError(t('errors.promptRequired'))
      setGenerationState('error')
      return
    }
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    const requestConfig = { ...config, ...generationOptions }
    const referenceFiles = referenceImages.map((reference) => reference.file)
    setGenerationState(referenceFiles.length ? 'preparing' : 'loading')
    setGenerationError('')
    try {
      const optimizedReferenceFiles = await losslesslyOptimizeReferenceImages(referenceFiles)
      setGenerationState('loading')
      const url = await generateImageRequest({
        config: requestConfig,
        prompt: promptText,
        referenceFiles: optimizedReferenceFiles,
        t,
        language,
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
        model: requestConfig.model.trim(),
        size: requestConfig.size,
        quality: requestConfig.quality,
        createdAt: new Date().toISOString(),
        referenceName: referenceImages.map((reference) => reference.file.name).join(', '),
      })
    } catch (error) {
      const message = error?.message || (language === 'zh' ? '生成失败' : 'Generation failed')
      setGenerationError(message.includes('Failed to fetch')
        ? t('errors.fetch')
        : message.includes('Could not read reference image') ? t('errors.fileRead')
          : message.includes('losslessly optimize') ? t('errors.imageOptimize') : message)
      setGenerationState('error')
    }
  }

  const requestGeneration = () => {
    if (!promptText.trim()) {
      setGenerationError(t('errors.promptRequired'))
      setGenerationState('error')
      return
    }
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    setGenerationError('')
    setGenerationOptions({ size: config.size, quality: config.quality })
    setGenerationSetupOpen(true)
  }

  const selectGenerationProfile = (id) => {
    const profile = profiles.find((candidate) => candidate.id === id)
    if (!profile) return
    onSelectConfig(id)
    setGenerationOptions({ size: profile.size, quality: profile.quality })
  }

  const confirmGeneration = () => {
    if (!promptText.trim()) {
      setGenerationError(t('errors.promptRequired'))
      setGenerationState('error')
      return
    }
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    setGenerationSetupOpen(false)
    runGeneration()
  }

  const handleReferenceChange = (event) => {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    if (!files.length) return
    if (files.some((file) => !REFERENCE_IMAGE_TYPES.has(file.type))) {
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

  const sourceImages = Array.isArray(item.images) && item.images.length
    ? item.images
    : item.image ? [{ url: item.image, width: item.width, height: item.height }] : []
  const safeSourceImageIndex = Math.min(sourceImageIndex, Math.max(0, sourceImages.length - 1))
  const sourceImage = sourceImages[safeSourceImageIndex]
  const displayImage = viewMode === 'generated' && generatedUrl ? generatedUrl : sourceImage?.url || item.image

  return (
    <div ref={detailDialogRef} className="detail-backdrop" role="dialog" aria-modal="true" aria-label={t('gallery.viewDetails', { title: item.title })} data-dialog-layer="true" tabIndex={-1}>
      <div className="detail-topbar">
        <button onClick={onClose}><X size={19} /> {t('detail.close')}</button>
        {isCustomItem ? <span className="detail-history-label"><Sparkles size={14} />{t('custom.topbar')}</span> : !isHistoryItem ? <div>
          <IconButton label={t('actions.previous')} onClick={onPrev}><ArrowLeft size={19} /></IconButton>
          <IconButton label={t('actions.next')} onClick={onNext}><ArrowRight size={19} /></IconButton>
        </div> : <span className="detail-history-label"><History size={14} /> GENERATED HISTORY</span>}
      </div>
      <div className="detail-layout">
        <div className="detail-media">
          {displayImage ? (
            <button className="detail-image-trigger" onClick={() => setZoomedImage({ src: displayImage, alt: viewMode === 'generated' ? t('history.resultAlt', { title: item.title }) : item.title })} aria-label={t('detail.expand')}>
              <img src={displayImage} alt={viewMode === 'generated' ? t('history.resultAlt', { title: item.title }) : item.title} />
              <span>{t('detail.expand')}</span>
            </button>
          ) : generationState !== 'loading' && generationState !== 'preparing' ? (
            <div className="custom-media-empty">
              <Sparkles size={31} />
              <span>{t('custom.mediaEmpty')}</span>
            </div>
          ) : null}
          <div className="detail-media-index">{isCustomItem ? 'PROMPT—SIGNAL—STUDIO' : 'GPT—IMAGE—2'}</div>
          {sourceImages.length > 1 && viewMode === 'source' ? (
            <>
              <IconButton className="source-image-nav source-image-nav-prev" label={t('detail.previousImage')} onClick={() => setSourceImageIndex((current) => (current - 1 + sourceImages.length) % sourceImages.length)}><ArrowLeft size={18} /></IconButton>
              <IconButton className="source-image-nav source-image-nav-next" label={t('detail.nextImage')} onClick={() => setSourceImageIndex((current) => (current + 1) % sourceImages.length)}><ArrowRight size={18} /></IconButton>
              <span className="source-image-count">{t('detail.imageCount', { current: safeSourceImageIndex + 1, total: sourceImages.length })}</span>
            </>
          ) : null}
          {generatedUrl && !isHistoryItem && !isCustomItem ? <div className="image-switcher"><button className={viewMode === 'source' ? 'is-active' : ''} onClick={() => setViewMode('source')}>{t('detail.source')}</button><button className={viewMode === 'generated' ? 'is-active' : ''} onClick={() => setViewMode('generated')}>{t('detail.generated')}</button></div> : null}
          {generationState === 'loading' || generationState === 'preparing' ? <div className="generation-overlay"><LoaderCircle size={23} className="spin" /><span>{t(generationState === 'preparing' ? 'detail.preparingImages' : 'detail.loading')}</span></div> : null}
        </div>
        <div className="detail-panel">
          <div className="detail-heading">
            <span>{isCustomItem ? t('custom.eyebrow') : categoryLabel(item.category, language)}</span>
            <h2>{item.title}</h2>
            {!isCustomItem ? <p>{t('detail.curatedBy', { author: item.author })}</p> : null}
            {item.promptStatus && item.promptStatus !== 'clean' ? <div className={`prompt-status prompt-status-${item.promptStatus}`}><span />{language === 'zh' ? (PROMPT_STATUS_LABELS_ZH[item.promptStatus] || item.promptStatus.toUpperCase()) : (PROMPT_STATUS_LABELS[item.promptStatus] || item.promptStatus.toUpperCase())}</div> : null}
          </div>

          <div className="prompt-block">
            <div className="prompt-label">
              <span>{t('detail.prompt')}</span>
              <div className="prompt-label-actions">
                {canRestorePrompt ? <button className="prompt-restore" onClick={() => { setPromptText(originalPrompt); setTemplateValues(createTemplateValues(item.promptVariables)); appliedTemplateValuesRef.current = {} }}><RotateCcw size={12} />{t('detail.restoreOriginal')}</button> : null}
                <span>{promptText.length} {t('detail.chars')}</span>
              </div>
            </div>
            <textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} aria-label={t('detail.confirmPrompt')} placeholder={isCustomItem ? t('custom.promptPlaceholder') : ''} />
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

          <div className={`detail-actions ${isCustomItem ? 'is-custom' : ''}`}>
            {!isCustomItem ? <button className="copy-button" onClick={() => onCopy(promptText)}>
              <Copy size={18} /> {t('detail.copy')}
            </button> : null}
            <button className="generate-button" onClick={requestGeneration} disabled={generationState === 'loading' || generationState === 'preparing'}>
              {generationState === 'loading' || generationState === 'preparing' ? <LoaderCircle size={18} className="spin" /> : <Sparkles size={18} />} {t('detail.generate')}
            </button>
            {!isHistoryItem && !isCustomItem ? <IconButton
              label={favorite ? t('actions.unfavorite') : t('actions.favorite')}
              className={favorite ? 'detail-favorite is-active' : 'detail-favorite'}
              onClick={() => onFavorite(item.id)}
            >
              <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
            </IconButton> : null}
            {!isHistoryItem && !isCustomItem ? <IconButton label={t('detail.share')} className="detail-share" onClick={onCopyLink}><Share2 size={19} /></IconButton> : null}
          </div>

          {generationState === 'error' ? <div className="generation-error" role="alert">{generationError}<button onClick={onOpenSettings}><Settings2 size={14} />{t('detail.checkSettings')}</button></div> : null}
          {generatedUrl ? <a className="download-link" href={generatedUrl} download="prompt-signal-generated.png" target="_blank" rel="noreferrer"><Download size={16} />{t('detail.download')}</a> : null}

          {isHistoryItem ? <div className="history-detail-meta"><span><Clock3 size={13} /> {formatHistoryDate(item.createdAt, language)}</span><span>{t('detail.historyMeta', { model: item.model || 'IMAGE MODEL', size: item.size || 'auto', quality: item.quality || 'auto' })}</span>{item.referenceName ? <span>{t('history.reference', { name: item.referenceName })}</span> : null}</div> : !isCustomItem ? <div className="source-link">
            <span><i /> {t('detail.source')}</span>
            <div className="source-links">
              {getItemSources(item).map((source) => <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14} /></a>)}
            </div>
          </div> : null}
        </div>
      </div>
      {generationSetupOpen ? (
        <div ref={setupDialogRef} className="generation-confirm-backdrop" role="dialog" aria-modal="true" aria-label={t('detail.confirmTitle')} data-dialog-layer="true" tabIndex={-1}>
          <div className="generation-confirm generation-setup">
            <div className="generation-confirm-heading"><span>{t('detail.confirmEyebrow')}</span><IconButton label={t('detail.cancelGeneration')} onClick={() => setGenerationSetupOpen(false)}><X size={17} /></IconButton></div>
            <h3>{t('detail.confirmTitle')}</h3>
            <p>{t('detail.confirmCopy')}</p>
            <label className="confirm-prompt-field"><span>{t('detail.confirmPrompt')}</span><textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} /></label>
            <div className="generation-setup-reference">
              <div className="reference-upload-heading"><span>{t('detail.reference')}</span><span>{referenceImages.length ? t('detail.referenceCount', { count: referenceImages.length }) : t('detail.optional')}</span></div>
              {referenceImages.length ? <div className="reference-preview-grid">{referenceImages.map((reference) => <div className="reference-preview" key={reference.id}><button className="reference-preview-image" onClick={() => setZoomedImage({ src: reference.preview, alt: reference.file.name })} aria-label={`${t('detail.expand')} · ${reference.file.name}`}><img src={reference.preview} alt={reference.file.name} /></button><span title={reference.file.name}>{reference.file.name}</span><IconButton label={`${t('detail.referenceRemove')} · ${reference.file.name}`} onClick={() => removeReference(reference.id)}><X size={14} /></IconButton></div>)}</div> : null}
              {referenceImages.length < MAX_REFERENCE_IMAGES ? <label className="upload-reference"><Upload size={17} /><span>{referenceImages.length ? t('detail.referenceAdd') : t('detail.referenceUpload')}</span><small>{t('detail.referenceHint')}</small><input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={handleReferenceChange} /></label> : null}
            </div>
            <div className="generation-setup-model">
              <div className="generation-setup-label"><span>{t('detail.imageEngine')}</span><button onClick={() => { setGenerationSetupOpen(false); onOpenSettings() }}><Settings2 size={14} />{t('detail.editModels')}</button></div>
              <label><select value={config.id} onChange={(event) => selectGenerationProfile(event.target.value)}>{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name} · {profile.model || t('settings.notConfigured')}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></label>
              <div className={`generation-output-settings ${config.protocol === 'generate-content' ? 'is-single' : ''}`}>
                <span>{t('detail.outputSettings')}</span>
                <label className="generation-option"><span>{t('detail.size')}</span><span><select value={generationOptions.size} onChange={(event) => setGenerationOptions((current) => ({ ...current, size: event.target.value }))}><option value="auto">auto</option><option value="1024x1024">1024x1024 (1:1)</option><option value="1536x1024">1536x1024 (3:2)</option><option value="1024x1536">1024x1536 (2:3)</option><option value="1792x1024">1792x1024 (16:9)</option><option value="1024x1792">1024x1792 (9:16)</option></select><ChevronDown size={15} aria-hidden="true" /></span></label>
                {config.protocol === 'images' ? <label className="generation-option"><span>{t('detail.quality')}</span><span><select value={generationOptions.quality} onChange={(event) => setGenerationOptions((current) => ({ ...current, quality: event.target.value }))}><option value="auto">auto</option><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="standard">standard</option><option value="hd">hd</option></select><ChevronDown size={15} aria-hidden="true" /></span></label> : null}
              </div>
            </div>
            <div className="generation-confirm-actions"><button className="confirm-cancel" onClick={() => setGenerationSetupOpen(false)}>{t('detail.confirmCancel')}</button><button className="confirm-submit" onClick={confirmGeneration}><Sparkles size={17} />{t('detail.confirmSubmit')}</button></div>
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
  const [customOpen, setCustomOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [settingsDraft, setSettingsDraft] = useState(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [apiConfigStore, setApiConfigStore] = useState(readApiConfigStore)
  const [visibleLimit, setVisibleLimit] = useState(GALLERY_PAGE_SIZE)
  const generationHistoryRef = useRef([])
  const pendingGalleryScrollRef = useRef(null)
  const detailOpenedInSessionRef = useRef(false)
  const toastTimerRef = useRef(null)
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const apiConfig = useMemo(() => apiConfigStore.profiles.find((profile) => profile.id === apiConfigStore.activeId) || apiConfigStore.profiles[0], [apiConfigStore])
  const settingsConfig = settingsDraft?.profiles.find((profile) => profile.id === settingsDraft.activeId) || settingsDraft?.profiles[0]
  const customItem = {
    id: 'custom-generation',
    kind: 'custom-generation',
    title: t('custom.title'),
    category: 'other',
    author: 'PROMPT/SIGNAL',
    prompt: '',
    image: '',
    sources: [],
  }

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

  const scrollToResults = () => {
    pendingGalleryScrollRef.current = null
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const resultsAnchor = document.getElementById('results-start')
        if (!resultsAnchor) return
        const headerHeight = window.innerWidth <= 820 ? 64 : 74
        const targetTop = Math.max(0, window.scrollY + resultsAnchor.getBoundingClientRect().top - headerHeight)
        if (Math.abs(window.scrollY - targetTop) < 120) return
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: targetTop, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
      })
    })
  }

  const changeCategory = (categoryId) => {
    if (categoryId === activeCategory) return
    setActiveCategory(categoryId)
    scrollToResults()
  }

  const toggleFavoritesView = () => {
    setShowFavorites((value) => !value)
    scrollToResults()
  }

  const openApiSettings = () => {
    setSettingsDraft({ ...apiConfigStore, profiles: apiConfigStore.profiles.map((profile) => ({ ...profile })) })
  }

  const testApiConnection = (config) => testImageModelConnection({ config, t })

  const updateDraftApiProfile = (patch) => {
    setSettingsDraft((current) => current ? ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === current.activeId ? { ...profile, ...patch } : profile),
    }) : current)
  }

  const selectApiProfile = (id, persist = false) => {
    if (!apiConfigStore.profiles.some((profile) => profile.id === id)) return
    const next = { ...apiConfigStore, activeId: id }
    setApiConfigStore(next)
    if (persist) localStorage.setItem(IMAGE_API_CONFIG_KEY, JSON.stringify(next))
  }

  const selectDraftApiProfile = (id) => {
    setSettingsDraft((current) => current?.profiles.some((profile) => profile.id === id) ? { ...current, activeId: id } : current)
  }

  const addDraftApiProfile = (name) => {
    setSettingsDraft((current) => {
      if (!current) return current
      const profile = createApiProfile(current.profiles.length, { name })
      return { ...current, activeId: profile.id, profiles: [...current.profiles, profile] }
    })
  }

  const removeActiveDraftApiProfile = () => {
    setSettingsDraft((current) => {
      if (!current || current.profiles.length === 1) return current
      const activeIndex = current.profiles.findIndex((profile) => profile.id === current.activeId)
      const profiles = current.profiles.filter((profile) => profile.id !== current.activeId)
      const nextActive = profiles[Math.min(activeIndex, profiles.length - 1)] || profiles[0]
      return { ...current, activeId: nextActive.id, profiles }
    })
  }

  const saveApiConfig = () => {
    if (!settingsDraft) return
    const next = normalizeApiConfigStore(settingsDraft) || createApiConfigStore()
    localStorage.setItem(IMAGE_API_CONFIG_KEY, JSON.stringify(next))
    setApiConfigStore(next)
    setSettingsDraft(null)
    showToast(t('toast.settingsSaved'))
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
        onToggleFavorites={toggleFavoritesView}
        historyCount={generationHistory.length}
        onCreate={() => setCustomOpen(true)}
        onHistory={() => setHistoryOpen(true)}
        onSettings={openApiSettings}
      />
      <main>
        <Intro count={catalogLoading ? null : promptCatalog.length} />
        <div id="results-start" className="results-anchor" aria-hidden="true" />
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={changeCategory}
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

      {customOpen ? (
        <DetailView
          item={customItem}
          favorite={false}
          onFavorite={() => {}}
          onClose={() => setCustomOpen(false)}
          onPrev={() => {}}
          onNext={() => {}}
          onCopy={copyPrompt}
          onCopyLink={() => {}}
          config={apiConfig}
          profiles={apiConfigStore.profiles}
          onSelectConfig={(id) => selectApiProfile(id, true)}
          onOpenSettings={openApiSettings}
          onGenerationComplete={saveGeneration}
        />
      ) : selected ? (
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
          profiles={apiConfigStore.profiles}
          onSelectConfig={(id) => selectApiProfile(id, true)}
          onOpenSettings={openApiSettings}
          onGenerationComplete={saveGeneration}
        />
      ) : null}

      {historyOpen ? <HistoryPanel records={generationHistory} loading={historyLoading} onOpen={openHistoryRecord} onDelete={removeGenerationHistory} onClear={clearGenerationHistory} onClose={() => setHistoryOpen(false)} /> : null}
      {settingsDraft && settingsConfig ? <SettingsPanel config={settingsConfig} profiles={settingsDraft.profiles} activeId={settingsDraft.activeId} onChange={updateDraftApiProfile} onSelect={selectDraftApiProfile} onAdd={addDraftApiProfile} onRemove={removeActiveDraftApiProfile} onSave={saveApiConfig} onClose={() => setSettingsDraft(null)} onTestConnection={testApiConnection} /> : null}

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status">
        <Check size={17} /> {toast}
      </div>
    </>
  )
}

export default function App() {
  return <ThemeProvider><LanguageProvider><AppContent /></LanguageProvider></ThemeProvider>
}
