import { useDeferredValue, useEffect, useMemo, useState } from 'react'
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
  template: 'TEMPLATE · EDITABLE PARAMETERS',
  structured: 'STRUCTURED · FORMATTED',
  bilingual: 'BILINGUAL · CN / EN',
  reconstructed: 'RECONSTRUCTED · SOURCE DESCRIPTION',
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

function formatHistoryDate(value) {
  try {
    return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  } catch {
    return '刚刚'
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

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Prompt Signal 首页">
        <span className="brand-mark"><BrandMark /></span>
        <span>PROMPT<span>/SIGNAL</span></span>
      </a>

      <div className={`search-shell ${mobileSearch ? 'is-open' : ''}`}>
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索风格、作者、Prompt..."
          aria-label="搜索 Prompt"
        />
        {search ? (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="清空搜索">
            <X size={15} />
          </button>
        ) : null}
      </div>

      <nav className="header-actions" aria-label="快捷操作">
        <IconButton label="搜索" className="mobile-only" onClick={() => setMobileSearch((value) => !value)}>
          <Search size={19} />
        </IconButton>
        <button
          className={`favorites-button ${showFavorites ? 'is-active' : ''}`}
          onClick={() => setShowFavorites((value) => !value)}
          aria-pressed={showFavorites}
        >
          <Heart size={18} fill={showFavorites ? 'currentColor' : 'none'} />
          <span>收藏</span>
          <b>{favoriteCount}</b>
        </button>
        <button className="history-button" onClick={onHistory} aria-label="生成记录" title="生成记录">
          <History size={18} />
          <span>生成记录</span>
          <b>{historyCount}</b>
        </button>
        <IconButton label="图片模型配置" onClick={onSettings}>
          <Settings2 size={18} />
        </IconButton>
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
  return (
    <div className="settings-backdrop" role="dialog" aria-modal="true" aria-label="图片模型配置">
      <div className="settings-panel">
        <div className="settings-heading">
          <div><span>IMAGE ENGINE</span><h2>图片模型配置</h2></div>
          <IconButton label="关闭配置" onClick={onClose}><X size={19} /></IconButton>
        </div>
        <p className="settings-note">配置会保存在当前浏览器，仅在点击生成时发送到你填写的地址。请填写兼容 OpenAI Images API 的生成接口。</p>
        <label className="settings-field"><span>API URL</span><input value={config.endpoint} onChange={(e) => onChange({ endpoint: e.target.value })} placeholder="https://your-provider.example/v1/images/generations" /></label>
        <label className="settings-field"><span>API KEY</span><div className="key-input"><input type={showKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => onChange({ apiKey: e.target.value })} placeholder="sk-..." autoComplete="off" /><IconButton label={showKey ? '隐藏 API Key' : '显示 API Key'} onClick={() => setShowKey((v) => !v)}>{showKey ? <EyeOff size={17} /> : <Eye size={17} />}</IconButton></div></label>
        <div className="settings-grid">
          <label className="settings-field"><span>MODEL</span><input value={config.model} onChange={(e) => onChange({ model: e.target.value })} placeholder="例如 gpt-image-2" /></label>
          <label className="settings-field"><span>SIZE</span><select value={config.size} onChange={(e) => onChange({ size: e.target.value })}><option>auto</option><option>1024x1024</option><option>1536x1024</option><option>1024x1536</option></select></label>
          <label className="settings-field"><span>QUALITY</span><select value={config.quality} onChange={(e) => onChange({ quality: e.target.value })}><option>auto</option><option>low</option><option>medium</option><option>high</option></select></label>
        </div>
        <div className="settings-actions"><button className="settings-save" onClick={onSave}><Check size={17} />保存配置</button><button className="settings-clear" onClick={onClear}>清除本地配置</button></div>
        <div className="settings-security"><KeyRound size={14} />浏览器本地保存 · 不会上传到 Prompt Signal</div>
      </div>
    </div>
  )
}

function HistoryPanel({ records, onOpen, onClear, onClose }) {
  return (
    <div className="history-backdrop" role="dialog" aria-modal="true" aria-label="生成记录">
      <div className="history-panel">
        <div className="history-heading">
          <div><span>LOCAL ARCHIVE</span><h2>生成记录</h2></div>
          <IconButton label="关闭生成记录" onClick={onClose}><X size={19} /></IconButton>
        </div>
        <div className="history-toolbar">
          <span>{records.length} / {MAX_GENERATION_HISTORY} RECORDS</span>
          {records.length ? <button onClick={onClear}><Trash2 size={14} />清空记录</button> : null}
        </div>
        {records.length ? (
          <div className="history-grid">
            {records.map((record) => (
              <article className="history-card" key={record.id}>
                <button className="history-card-image" onClick={() => onOpen(record)} aria-label={`查看 ${record.title} 生成记录`}>
                  <img src={record.image} alt={`${record.title} 生成结果`} />
                  <span>OPEN <ArrowUpRight size={14} /></span>
                </button>
                <div className="history-card-info">
                  <div>
                    <span>{formatHistoryDate(record.createdAt)} · {record.model || 'IMAGE MODEL'}</span>
                    <h3>{record.title}</h3>
                  </div>
                  <p>{record.prompt}</p>
                  {record.referenceName ? <small>REFERENCE · {record.referenceName}</small> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <History size={28} />
            <h3>还没有生成记录</h3>
            <p>在案例详情中生成图片后，结果会自动保存在这里。</p>
          </div>
        )}
      </div>
    </div>
  )
}


function Intro({ count }) {
  return (
    <section className="intro" id="top">
      <div className="intro-title">
        <h1>Image prompts<br /><em>worth stealing.</em></h1>
      </div>
      <div className="intro-note">
        <span className="live-dot" />
        <p>从 X 与 GitHub 热门案例中筛选的<br />GPT-Image-2 实战灵感库</p>
        <strong>{String(count).padStart(2, '0')} / CURATED</strong>
      </div>
    </section>
  )
}

function FilterBar({ activeCategory, setActiveCategory, resultCount, sort, setSort }) {
  return (
    <div className="filter-sticky">
      <div className="filter-bar">
        <div className="category-scroll" role="tablist" aria-label="案例类型">
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? 'is-active' : ''}
              onClick={() => setActiveCategory(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="filter-meta">
          <span>{String(resultCount).padStart(2, '0')} RESULTS</span>
          <label>
            <span className="sr-only">排序方式</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">最新添加</option>
              <option value="curated">精选排序</option>
              <option value="title">标题排序</option>
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
  return (
    <article className={`gallery-card ratio-${item.ratio}`} style={{ '--delay': `${Math.min(index, 9) * 45}ms` }}>
      <button className={`card-image is-${imageState}`} onClick={() => onOpen(item)} aria-label={`查看 ${item.title} 详情`} aria-busy={imageState === 'loading'}>
        <span className="image-skeleton" aria-hidden="true" />
        {imageState === 'error' ? <span className="image-fallback">IMAGE UNAVAILABLE</span> : null}
        <img src={item.image} alt={item.title} loading={index > 5 ? 'lazy' : 'eager'} onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} />
        <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="view-cue">VIEW PROMPT <ArrowUpRight size={16} /></span>
      </button>
      <div className="card-info">
        <div>
          <span className="card-category">{CATEGORY_LABELS.get(item.category)}</span>
          <h2>{item.title}</h2>
          <p>{item.author} · {item.sourceLabel}</p>
        </div>
        <IconButton
          label={favorite ? '取消收藏' : '收藏'}
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
  return (
    <div className="empty-state">
      <span>NO SIGNAL</span>
      <h2>{showFavorites ? '还没有收藏案例' : '没有匹配的 Prompt'}</h2>
      <button onClick={clearFilters}>查看全部案例</button>
    </div>
  )
}

function DetailView({ item, favorite, onFavorite, onClose, onPrev, onNext, onCopy, config, onOpenSettings, onGenerationComplete }) {
  const isHistoryItem = item.kind === 'generation-history'
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
      if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `请求失败（HTTP ${response.status}）`)
      const output = payload?.data?.[0]
      const url = output?.url || (output?.b64_json ? `data:image/png;base64,${output.b64_json}` : '')
      if (!url) throw new Error('接口没有返回图片 URL 或 b64_json')
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
      const message = error?.message || '生成失败'
      setGenerationError(message.includes('Failed to fetch') ? '无法连接接口。请检查 API URL、CORS 或网络设置。' : message)
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
      setGenerationError('请选择 PNG、JPEG、WEBP 等图片文件。')
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
    <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={`${item.title} 详情`}>
      <div className="detail-topbar">
        <button onClick={onClose}><X size={19} /> CLOSE</button>
        {!isHistoryItem ? <div>
          <IconButton label="上一个案例" onClick={onPrev}><ArrowLeft size={19} /></IconButton>
          <IconButton label="下一个案例" onClick={onNext}><ArrowRight size={19} /></IconButton>
        </div> : <span className="detail-history-label"><History size={14} /> GENERATED HISTORY</span>}
      </div>
      <div className="detail-layout">
        <div className="detail-media">
          <button className="detail-image-trigger" onClick={() => setZoomedImage({ src: displayImage, alt: viewMode === 'generated' ? `${item.title} 生成结果` : item.title })} aria-label="放大查看图片">
            <img src={displayImage} alt={viewMode === 'generated' ? `${item.title} 生成结果` : item.title} />
            <span>CLICK TO EXPAND</span>
          </button>
          <div className="detail-media-index">GPT—IMAGE—2</div>
          {generatedUrl && !isHistoryItem ? <div className="image-switcher"><button className={viewMode === 'source' ? 'is-active' : ''} onClick={() => setViewMode('source')}>SOURCE</button><button className={viewMode === 'generated' ? 'is-active' : ''} onClick={() => setViewMode('generated')}>GENERATED</button></div> : null}
          {generationState === 'loading' ? <div className="generation-overlay"><LoaderCircle size={23} className="spin" /><span>正在生成图像…</span></div> : null}
        </div>
        <div className="detail-panel">
          <div className="detail-heading">
            <span>{CATEGORY_LABELS.get(item.category)}</span>
            <h2>{item.title}</h2>
            <p>CURATED BY {item.author}</p>
            {item.promptStatus && item.promptStatus !== 'clean' ? <div className={`prompt-status prompt-status-${item.promptStatus}`}><span />{PROMPT_STATUS_LABELS[item.promptStatus] || item.promptStatus.toUpperCase()}</div> : null}
          </div>

          <div className="prompt-block">
            <div className="prompt-label">
              <span>PROMPT</span>
              <span>{item.prompt.length} CHAR</span>
            </div>
            <textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} aria-label="可编辑 Prompt" />
          </div>

          <div className="reference-upload">
            <div className="reference-upload-heading"><span>REFERENCE IMAGE</span><span>OPTIONAL</span></div>
            {referencePreview ? (
              <div className="reference-preview">
                <button className="reference-preview-image" onClick={() => setZoomedImage({ src: referencePreview, alt: '待上传的参考图' })} aria-label="放大查看参考图"><img src={referencePreview} alt="待上传的参考图" /></button>
                <div><span>{referenceFile?.name}</span><button onClick={clearReference}><X size={14} />移除</button></div>
              </div>
            ) : (
              <label className="upload-reference"><Upload size={17} /><span>上传本地图片作为参考</span><small>PNG / JPG / WEBP · 生成时发送给模型</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleReferenceChange} /></label>
            )}
          </div>

          <div className="detail-actions">
            <button className="copy-button" onClick={() => onCopy(promptText)}>
              <Copy size={18} /> 复制 Prompt
            </button>
            <button className="generate-button" onClick={requestGeneration} disabled={generationState === 'loading'}>
              {generationState === 'loading' ? <LoaderCircle size={18} className="spin" /> : <Sparkles size={18} />} 生成
            </button>
            {!isHistoryItem ? <IconButton
              label={favorite ? '取消收藏' : '收藏'}
              className={favorite ? 'detail-favorite is-active' : 'detail-favorite'}
              onClick={() => onFavorite(item.id)}
            >
              <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
            </IconButton> : null}
          </div>
          {generationState === 'error' ? <div className="generation-error" role="alert">{generationError}<button onClick={onOpenSettings}><Settings2 size={14} />检查配置</button></div> : null}
          {generatedUrl ? <a className="download-link" href={generatedUrl} download="prompt-signal-generated.png" target="_blank" rel="noreferrer"><Download size={16} />下载生成结果</a> : null}

          {isHistoryItem ? <div className="history-detail-meta"><span><Clock3 size={13} /> {formatHistoryDate(item.createdAt)}</span><span>{item.model || 'IMAGE MODEL'} · {item.size || 'auto'} · {item.quality || 'auto'}</span>{item.referenceName ? <span>REFERENCE · {item.referenceName}</span> : null}</div> : <div className="source-link">
            <span><i /> SOURCE</span>
            <div className="source-links">
              {getItemSources(item).map((source) => <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14} /></a>)}
            </div>
          </div>}
        </div>
      </div>
      {confirmOpen ? (
        <div className="generation-confirm-backdrop" role="dialog" aria-modal="true" aria-label="确认生成图片">
          <div className="generation-confirm">
            <div className="generation-confirm-heading"><span>READY TO RENDER</span><IconButton label="取消生成" onClick={() => setConfirmOpen(false)}><X size={17} /></IconButton></div>
            <h3>确认生成这张图片？</h3>
            <p>将使用当前 Prompt 调用已配置的图片模型。确认后才会向第三方接口发送请求。</p>
            <label className="confirm-prompt-field"><span>PROMPT · 可在这里二次编辑</span><textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} /></label>
            {referencePreview ? <div className="confirm-reference"><span>REFERENCE IMAGE</span><button onClick={() => setZoomedImage({ src: referencePreview, alt: referenceFile?.name || '待上传的参考图' })}><img src={referencePreview} alt={referenceFile?.name || '待上传的参考图'} /><div><b>{referenceFile?.name || 'REFERENCE IMAGE'}</b><small>点击缩略图放大预览</small></div></button></div> : null}
            <div className="generation-confirm-meta"><span>MODEL <b>{config.model}</b></span><span>REFERENCE <b>{referenceFile ? 'ATTACHED' : 'NONE'}</b></span></div>
            <div className="generation-confirm-actions"><button className="confirm-cancel" onClick={() => setConfirmOpen(false)}>取消</button><button className="confirm-submit" onClick={() => { setConfirmOpen(false); runGeneration() }}><Sparkles size={17} />确认生成</button></div>
          </div>
        </div>
      ) : null}
      {zoomedImage ? <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="图片预览" onClick={() => setZoomedImage(null)}><button onClick={() => setZoomedImage(null)} aria-label="关闭图片预览"><X size={22} /></button><img src={zoomedImage.src} alt={zoomedImage.alt} onClick={(event) => event.stopPropagation()} /></div> : null}
    </div>
  )
}

export default function App() {
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
            {visibleLimit < filteredPrompts.length ? <div className="load-more-wrap"><button className="load-more" onClick={() => setVisibleLimit((limit) => limit + 48)}>加载更多案例 <ArrowDown size={17} /></button><span>已显示 {Math.min(visibleLimit, filteredPrompts.length)} / {filteredPrompts.length} · 向下探索完整案例库</span></div> : null}
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
        <p>OPEN PROMPTS · REAL OUTPUTS · 2026</p>
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
        <Check size={17} /> Prompt 已复制到剪贴板
      </div>
    </>
  )
}
