import { createContext, useContext, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
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
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { categories, prompts, PROJECT_REPO } from './data.js'

const CATEGORY_LABELS = new Map(categories.map((item) => [item.id, item.label]))
const LANGUAGE_KEY = 'prompt-signal:language:v1'
const FAVORITES_KEY = 'prompt-signal:favorites:v1'
const IMAGE_API_CONFIG_KEY = 'prompt-signal:image-api:v1'
const GENERATION_HISTORY_KEY = 'prompt-signal:generation-history:v1'
const MAX_GENERATION_HISTORY = 30
const DEFAULT_API_CONFIG = {
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
    'settings.note': 'Settings stay in this browser and are sent only when you generate. Use an image endpoint that follows a common Images API format.',
    'settings.apiUrl': 'API URL',
    'settings.apiKey': 'API KEY',
    'settings.model': 'MODEL',
    'settings.modelPlaceholder': 'e.g. gpt-image-2',
    'settings.endpointPlaceholder': 'https://your-endpoint.example/v1/images/generations',
    'settings.save': 'Save settings',
    'settings.clear': 'Clear local settings',
    'settings.security': 'Stored locally in this browser · never uploaded to Prompt Signal',
    'history.eyebrow': 'LOCAL ARCHIVE',
    'history.title': 'Generation history',
    'history.records': '{{count}} / {{max}} RECORDS',
    'history.clear': 'Clear history',
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
    'filters.curated': 'Curated order',
    'filters.title': 'Title A–Z',
    'gallery.view': 'VIEW PROMPT',
    'gallery.unavailable': 'IMAGE UNAVAILABLE',
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
    'detail.chars': 'CHAR',
    'detail.reference': 'REFERENCE IMAGE',
    'detail.optional': 'OPTIONAL',
    'detail.referenceUpload': 'Upload a local image as reference',
    'detail.referenceHint': 'PNG / JPG / WEBP · Sent to the model when generating',
    'detail.referenceRemove': 'Remove reference image',
    'detail.referenceAlt': 'Reference image preview',
    'detail.copy': 'Copy prompt',
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
    'toast.copied': 'Prompt copied to clipboard',
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
    'settings.note': '配置会保存在当前浏览器，仅在点击生成时发送。请填写兼容常见 Images API 格式的图片接口。',
    'settings.apiUrl': 'API URL',
    'settings.apiKey': 'API KEY',
    'settings.model': 'MODEL',
    'settings.modelPlaceholder': '例如 gpt-image-2',
    'settings.endpointPlaceholder': 'https://your-endpoint.example/v1/images/generations',
    'settings.save': '保存配置',
    'settings.clear': '清除本地配置',
    'settings.security': '浏览器本地保存 · 不会上传到 Prompt Signal',
    'history.eyebrow': 'LOCAL ARCHIVE',
    'history.title': '生成记录',
    'history.records': '{{count}} / {{max}} RECORDS',
    'history.clear': '清空记录',
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
    'filters.curated': '精选排序',
    'filters.title': '标题排序',
    'gallery.view': '查看 Prompt',
    'gallery.unavailable': '图片不可用',
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
    'detail.chars': '字符',
    'detail.reference': 'REFERENCE IMAGE',
    'detail.optional': '可选',
    'detail.referenceUpload': '上传本地图片作为参考',
    'detail.referenceHint': 'PNG / JPG / WEBP · 生成时发送给模型',
    'detail.referenceRemove': '移除参考图',
    'detail.referenceAlt': '待上传的参考图',
    'detail.copy': '复制 Prompt',
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
    'toast.copied': 'Prompt 已复制到剪贴板',
    'footer': 'OPEN PROMPTS · REAL OUTPUTS · 2026',
  },
}

const LanguageContext = createContext(null)

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
  return (
    <div className="settings-backdrop" role="dialog" aria-modal="true" aria-label={t('settings.title')}>
      <div className="settings-panel">
        <div className="settings-heading">
          <div><span>{t('settings.eyebrow')}</span><h2>{t('settings.title')}</h2></div>
          <IconButton label={t('actions.closeSettings')} onClick={onClose}><X size={19} /></IconButton>
        </div>
        <p className="settings-note">{t('settings.note')}</p>
        <label className="settings-field"><span>{t('settings.apiUrl')}</span><input value={config.endpoint} onChange={(e) => onChange({ endpoint: e.target.value })} placeholder={t('settings.endpointPlaceholder')} /></label>
        <label className="settings-field"><span>{t('settings.apiKey')}</span><div className="key-input"><input type={showKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => onChange({ apiKey: e.target.value })} placeholder="sk-..." autoComplete="off" /><IconButton label={showKey ? t('actions.hideKey') : t('actions.showKey')} onClick={() => setShowKey((v) => !v)}>{showKey ? <EyeOff size={17} /> : <Eye size={17} />}</IconButton></div></label>
        <div className="settings-grid">
          <label className="settings-field"><span>{t('settings.model')}</span><input value={config.model} onChange={(e) => onChange({ model: e.target.value })} placeholder={t('settings.modelPlaceholder')} /></label>
          <label className="settings-field"><span>SIZE</span><select value={config.size} onChange={(e) => onChange({ size: e.target.value })}><option>auto</option><option>1024x1024</option><option>1536x1024</option><option>1024x1536</option></select></label>
          <label className="settings-field"><span>QUALITY</span><select value={config.quality} onChange={(e) => onChange({ quality: e.target.value })}><option>auto</option><option>low</option><option>medium</option><option>high</option></select></label>
        </div>
        <div className="settings-actions"><button className="settings-save" onClick={onSave}><Check size={17} />{t('settings.save')}</button><button className="settings-clear" onClick={onClear}>{t('settings.clear')}</button></div>
        <div className="settings-security"><KeyRound size={14} />{t('settings.security')}</div>
      </div>
    </div>
  )
}

function HistoryPanel({ records, onOpen, onClear, onClose }) {
  const { language, t } = useLanguage()
  return (
    <div className="history-backdrop" role="dialog" aria-modal="true" aria-label={t('history.title')}>
      <div className="history-panel">
        <div className="history-heading">
          <div><span>{t('history.eyebrow')}</span><h2>{t('history.title')}</h2></div>
          <IconButton label={t('actions.closeHistory')} onClick={onClose}><X size={19} /></IconButton>
        </div>
        <div className="history-toolbar">
          <span>{t('history.records', { count: records.length, max: MAX_GENERATION_HISTORY })}</span>
          {records.length ? <button onClick={onClear}><Trash2 size={14} />{t('history.clear')}</button> : null}
        </div>
        {records.length ? (
          <div className="history-grid">
            {records.map((record) => (
              <article className="history-card" key={record.id}>
                <button className="history-card-image" onClick={() => onOpen(record)} aria-label={t('history.open')}>
                  <img src={record.image} alt={t('history.resultAlt', { title: record.title })} />
                  <span>OPEN <ArrowUpRight size={14} /></span>
                </button>
                <div className="history-card-info">
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
        <strong>{String(count).padStart(2, '0')} / {t('intro.curated')}</strong>
      </div>
    </section>
  )
}

function FilterBar({ activeCategory, setActiveCategory, resultCount, sort, setSort }) {
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
          <span>{t('filters.results', { count: String(resultCount).padStart(2, '0') })}</span>
          <label>
            <span className="sr-only">{t('filters.sort')}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">{t('filters.newest')}</option>
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
  const imageRef = useRef(null)
  const { language, t } = useLanguage()

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    setImageState(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [item.image])

  return (
    <article className={`gallery-card ratio-${item.ratio}`} style={{ '--delay': `${Math.min(index, 9) * 45}ms` }}>
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

function DetailView({ item, favorite, onFavorite, onClose, onPrev, onNext, onCopy, config, onOpenSettings, onGenerationComplete }) {
  const isHistoryItem = item.kind === 'generation-history'
  const { language, t } = useLanguage()
  const [promptText, setPromptText] = useState(item.prompt)
  const [generatedUrl, setGeneratedUrl] = useState(item.generatedUrl || '')
  const [viewMode, setViewMode] = useState(item.generatedUrl ? 'generated' : 'source')
  const [generationState, setGenerationState] = useState('idle')
  const [generationError, setGenerationError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [referenceFile, setReferenceFile] = useState(null)
  const [referencePreview, setReferencePreview] = useState('')
  const [zoomedImage, setZoomedImage] = useState(null)

  useEffect(() => {
    setPromptText(item.prompt)
    setGeneratedUrl(item.generatedUrl || '')
    setViewMode(item.generatedUrl ? 'generated' : 'source')
    setGenerationState('idle')
    setGenerationError('')
    setReferenceFile(null)
    setReferencePreview('')
    setZoomedImage(null)
  }, [item.id, item.prompt])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, onNext, onPrev])

  const runGeneration = async () => {
    if (!config.apiKey.trim() || !config.endpoint.trim() || !config.model.trim()) {
      onOpenSettings()
      return
    }
    setGenerationState('loading')
    setGenerationError('')
    try {
      const endpoint = referenceFile
        ? config.endpoint.trim().replace(/\/generations\/?$/, '/edits')
        : config.endpoint.trim()
      const headers = { Authorization: `Bearer ${config.apiKey.trim()}` }
      let body
      if (referenceFile) {
        body = new FormData()
        body.append('image', referenceFile)
        body.append('model', config.model.trim())
        body.append('prompt', promptText)
        body.append('size', config.size)
        body.append('quality', config.quality)
        body.append('n', '1')
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({ model: config.model.trim(), prompt: promptText, size: config.size, quality: config.quality, n: 1 })
      }
      const response = await fetch(endpoint, { method: 'POST', headers, body })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload?.error?.message || payload?.message || t('errors.request', { status: response.status }))
      const output = payload?.data?.[0]
      const url = output?.url || (output?.b64_json ? `data:image/png;base64,${output.b64_json}` : '')
      if (!url) throw new Error(t('errors.imageResponse'))
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
        referenceName: referenceFile?.name || '',
        referencePreview: referencePreview.length <= 500000 ? referencePreview : '',
      })
    } catch (error) {
      const message = error?.message || (language === 'zh' ? '生成失败' : 'Generation failed')
      setGenerationError(message.includes('Failed to fetch') ? t('errors.fetch') : message)
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
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setGenerationError(t('errors.invalidFile'))
      setGenerationState('error')
      return
    }
    setReferenceFile(file)
    const reader = new FileReader()
    reader.onload = () => setReferencePreview(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const clearReference = () => {
    setReferenceFile(null)
    setReferencePreview('')
  }

  const displayImage = viewMode === 'generated' && generatedUrl ? generatedUrl : item.image

  return (
    <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={t('gallery.viewDetails', { title: item.title })}>
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

          <div className="reference-upload">
            <div className="reference-upload-heading"><span>{t('detail.reference')}</span><span>{t('detail.optional')}</span></div>
            {referencePreview ? (
              <div className="reference-preview">
                <button className="reference-preview-image" onClick={() => setZoomedImage({ src: referencePreview, alt: t('detail.referenceAlt') })} aria-label={t('detail.expand')}><img src={referencePreview} alt={t('detail.referenceAlt')} /></button>
                <div><span>{referenceFile?.name}</span><button onClick={clearReference}><X size={14} />{t('detail.referenceRemove')}</button></div>
              </div>
            ) : (
              <label className="upload-reference"><Upload size={17} /><span>{t('detail.referenceUpload')}</span><small>{t('detail.referenceHint')}</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleReferenceChange} /></label>
            )}
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
        <div className="generation-confirm-backdrop" role="dialog" aria-modal="true" aria-label={t('detail.confirmTitle')}>
          <div className="generation-confirm">
            <div className="generation-confirm-heading"><span>{t('detail.confirmEyebrow')}</span><IconButton label={t('detail.cancelGeneration')} onClick={() => setConfirmOpen(false)}><X size={17} /></IconButton></div>
            <h3>{t('detail.confirmTitle')}</h3>
            <p>{t('detail.confirmCopy')}</p>
            <label className="confirm-prompt-field"><span>{t('detail.confirmPrompt')}</span><textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} /></label>
            {referencePreview ? <div className="confirm-reference"><span>{t('detail.reference')}</span><button onClick={() => setZoomedImage({ src: referencePreview, alt: referenceFile?.name || t('detail.referenceAlt') })}><img src={referencePreview} alt={referenceFile?.name || t('detail.referenceAlt')} /><div><b>{referenceFile?.name || t('detail.reference')}</b><small>{t('detail.confirmPreview')}</small></div></button></div> : null}
            <div className="generation-confirm-meta"><span>MODEL <b>{config.model}</b></span><span>{t('detail.reference')} <b>{referenceFile ? t('detail.confirmAttached') : t('detail.confirmNone')}</b></span></div>
            <div className="generation-confirm-actions"><button className="confirm-cancel" onClick={() => setConfirmOpen(false)}>{t('detail.confirmCancel')}</button><button className="confirm-submit" onClick={() => { setConfirmOpen(false); runGeneration() }}><Sparkles size={17} />{t('detail.confirmSubmit')}</button></div>
          </div>
        </div>
      ) : null}
      {zoomedImage ? <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={t('detail.preview')} onClick={() => setZoomedImage(null)}><button onClick={() => setZoomedImage(null)} aria-label={t('actions.closeSettings')}><X size={22} /></button><img src={zoomedImage.src} alt={zoomedImage.alt} onClick={(event) => event.stopPropagation()} /></div> : null}
    </div>
  )
}

function AppContent() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState(readFavorites)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [toast, setToast] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [generationHistory, setGenerationHistory] = useState(readGenerationHistory)
  const [apiConfig, setApiConfig] = useState(readApiConfig)
  const [visibleLimit, setVisibleLimit] = useState(48)
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())

  const filteredPrompts = useMemo(() => {
    const result = prompts.filter((item) => {
      if (showFavorites && !favorites.has(item.id)) return false
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      if (!deferredSearch) return true
      return `${item.title} ${item.author} ${item.prompt}`.toLowerCase().includes(deferredSearch)
    })
    if (sort === 'title') return [...result].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'newest') return [...result].sort((a, b) => b.addedOrder - a.addedOrder)
    return result
  }, [activeCategory, deferredSearch, favorites, showFavorites, sort])

  useEffect(() => {
    setVisibleLimit(48)
  }, [activeCategory, deferredSearch, showFavorites, sort])

  const selected = selectedHistory || (selectedId ? prompts.find((item) => item.id === selectedId) : null)

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

  const navigateDetail = (direction) => {
    if (!selectedId || selectedHistory) return
    const index = prompts.findIndex((item) => item.id === selectedId)
    const nextIndex = (index + direction + prompts.length) % prompts.length
    setSelectedId(prompts[nextIndex].id)
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
    setToast(true)
    window.setTimeout(() => setToast(false), 1800)
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('all')
    setShowFavorites(false)
  }

  const saveApiConfig = () => {
    localStorage.setItem(IMAGE_API_CONFIG_KEY, JSON.stringify(apiConfig))
    setSettingsOpen(false)
    setToast(true)
    window.setTimeout(() => setToast(false), 1800)
  }

  const clearApiConfig = () => {
    localStorage.removeItem(IMAGE_API_CONFIG_KEY)
    setApiConfig(DEFAULT_API_CONFIG)
  }

  const saveGeneration = (record) => {
    setGenerationHistory((current) => writeGenerationHistory([record, ...current]))
  }

  const clearGenerationHistory = () => {
    localStorage.removeItem(GENERATION_HISTORY_KEY)
    setGenerationHistory([])
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
        <Intro count={prompts.length} />
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          resultCount={filteredPrompts.length}
          sort={sort}
          setSort={setSort}
        />
        {filteredPrompts.length ? (
          <>
            <section className="masonry" aria-live="polite">
              {filteredPrompts.slice(0, visibleLimit).map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  favorite={favorites.has(item.id)}
                  onOpen={(prompt) => setSelectedId(prompt.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </section>
            {visibleLimit < filteredPrompts.length ? <div className="load-more-wrap"><button className="load-more" onClick={() => setVisibleLimit((limit) => limit + 48)}>{t('loadMore.button')} <ArrowDown size={17} /></button><span>{t('loadMore.status', { shown: Math.min(visibleLimit, filteredPrompts.length), total: filteredPrompts.length })}</span></div> : null}
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
          onClose={() => { setSelectedId(null); setSelectedHistory(null) }}
          onPrev={() => navigateDetail(-1)}
          onNext={() => navigateDetail(1)}
          onCopy={copyPrompt}
          config={apiConfig}
          onOpenSettings={() => setSettingsOpen(true)}
          onGenerationComplete={saveGeneration}
        />
      ) : null}

      {historyOpen ? <HistoryPanel records={generationHistory} onOpen={openHistoryRecord} onClear={clearGenerationHistory} onClose={() => setHistoryOpen(false)} /> : null}
      {settingsOpen ? <SettingsPanel config={apiConfig} onChange={(patch) => setApiConfig((current) => ({ ...current, ...patch }))} onSave={saveApiConfig} onClear={clearApiConfig} onClose={() => setSettingsOpen(false)} /> : null}

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status">
        <Check size={17} /> {t('toast.copied')}
      </div>
    </>
  )
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>
}
