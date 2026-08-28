export const SOURCE_REPO = {
  name: 'wuyoscar/GPT-Image2-Skill',
  url: 'https://github.com/wuyoscar/GPT-Image2-Skill',
  stars: '4.9k',
}

export const SECOND_SOURCE_REPO = {
  name: 'freestylefly/awesome-gpt-image-2',
  url: 'https://github.com/freestylefly/awesome-gpt-image-2',
  stars: '19.1k',
}

export const PROJECT_REPO = {
  name: 'andy7076/image_prompt',
  url: 'https://github.com/andy7076/image_prompt',
  stars: null,
}

export const categories = [
  { id: 'all', label: '全部' },
  { id: 'photography', label: '摄影写实' },
  { id: 'product', label: '商业产品' },
  { id: 'poster', label: '海报字体' },
  { id: 'illustration', label: '插画艺术' },
  { id: 'technical', label: '图表信息图' },
  { id: 'ui', label: 'UI 界面' },
  { id: 'characters', label: '角色人物' },
  { id: 'anime', label: '动漫' },
  { id: 'isometric', label: '等距模型' },
  { id: 'brand', label: '品牌 Logo' },
  { id: 'scenes', label: '场景叙事' },
  { id: 'architecture', label: '建筑空间' },
  { id: 'documents', label: '文档出版' },
  { id: 'history', label: '历史古典' },
  { id: 'other', label: '其他玩法' },
]

export const featuredPrompts = [
  {
    id: 'raw-subway',
    title: '42nd Street / 瞬间模糊',
    category: 'photography',
    image: '/images/photoreal-subway.png',
    ratio: 'landscape',
    author: '@WolfRiccardo',
    sourceLabel: 'X',
    source: 'https://x.com/WolfRiccardo',
    accent: '#f2ff3d',
    prompt: 'Create a completely RAW quality, unprocessed, unedited image with full iPhone camera quality. A subway station in USA, a momentary blur. The subway is in motion. In front of the subway, there is an elderly woman and man.',
  },
  {
    id: 'notebook-flatlay',
    title: '手写笔记 / 窗边自然光',
    category: 'photography',
    image: '/images/handwritten-notebook.png',
    ratio: 'landscape',
    author: '@patrickassale',
    sourceLabel: 'X',
    source: 'https://x.com/patrickassale',
    accent: '#ff705c',
    prompt: 'Amateur photo of an open notebook lying flat, filled with handwritten notes in black ballpoint pen. The handwriting is casual and slightly messy, like personal notes, natural imperfections, crossed out words, underlined headings. Shot from slightly above, natural daylight from a window, no flash. Casual desk setting, shot on iPhone.',
  },
  {
    id: 'chess-midgame',
    title: '锦标赛残局 / 00:14:28',
    category: 'photography',
    image: '/images/chess-midgame.png',
    ratio: 'landscape',
    author: '@EddGorenstein',
    sourceLabel: 'X',
    source: 'https://x.com/EddGorenstein',
    accent: '#c5a276',
    prompt: 'Generate a photorealistic photo of a chess board during the middle of a serious tournament game. Top-down three-quarter view, shallow depth of field. All pieces clearly distinguishable and correctly shaped. The position is mid-game: several pieces already captured and set aside to the right of the board, some pawns advanced, pieces clustered around the central files d4-e5-f4. Materials: polished wooden Staunton-style pieces in rosewood and maple, with an inlaid maple and walnut board. A digital chess clock sits to the left showing "00:14:28 / 00:08:47". Soft overhead tournament lighting, blurred tournament-hall background. All pieces accurate, no mutants, no extra sets.',
  },
  {
    id: 'jungle-panorama',
    title: '史前丛林 / 360° 全景',
    category: 'photography',
    image: '/images/panorama-jungle.png',
    ratio: 'wide',
    author: '@AIimagined',
    sourceLabel: 'X',
    source: 'https://x.com/AIimagined',
    accent: '#6ee7a2',
    prompt: '360 equirectangular panorama of a dense prehistoric jungle scene. Cinematic detail. Strict 2:1 aspect ratio. No distortion at the seams — the left and right edges must wrap seamlessly. Towering fern-covered trees, shafts of golden sunlight piercing the canopy, a slow river winding through the centre foreground, mist rising off the water. Scattered dinosaurs of varied species: a grazing Brachiosaurus, two small Gallimimus drinking at the river edge, and a Triceratops in the background underbrush. Late-afternoon golden hour, warm directional backlight, high dynamic range, slight atmospheric haze.',
  },
  {
    id: 'chocolate-wafer',
    title: 'Hazelnut / 零重力产品片',
    category: 'product',
    image: '/images/product-chocolate-wafer.png',
    ratio: 'portrait',
    author: '@mehvishs25',
    sourceLabel: 'X',
    source: 'https://x.com/mehvishs25',
    accent: '#d79b67',
    prompt: 'Premium commercial food photography of chocolate-coated wafer rolls in a zero-gravity diagonal composition. Dark warm-brown background with floating particles, cinematic depth blur and warm directional studio light. Show irregular nut clusters embedded in the chocolate, a crispy hollow wafer cross-section and silky chocolate cream filling. Surround the hero with floating hazelnut halves, chocolate blocks and a thick glossy chocolate splash. Hyper-realistic, sharp foreground, indulgent mood, 8K detail, 3:4 portrait.',
  },
  {
    id: 'salad-explosion',
    title: 'Salad Burst / 冻结动势',
    category: 'product',
    image: '/images/food-salad-explosion.png',
    ratio: 'portrait',
    author: '@ChillaiKalan__',
    sourceLabel: 'X',
    source: 'https://x.com/ChillaiKalan__',
    accent: '#83d447',
    prompt: 'Hyper-realistic food photography of a dynamic salad explosion emerging from a matte black bowl on a round raw-oak surface. Ingredients are frozen mid-air: green lettuce, cherry tomatoes, cucumber, black olives, white cheese cubes, orange citrus, broccoli, basil, and a drizzle of olive oil caught mid-fall. Tiny droplets and water beads float between ingredients. Studio-grade, high-contrast cinematic lighting, extreme sharpness and micro-texture, softly graded off-white to warm beige background, editorial cookbook-cover finish.',
  },
  {
    id: 'aurora-oolong',
    title: 'Aurora Oolong / 商业海报',
    category: 'product',
    image: '/images/aurora-oolong-poster.png',
    ratio: 'portrait',
    author: 'Community Pick',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#8fe8da',
    prompt: 'Design a high-end commercial poster for a product called "Aurora Oolong Cold Brew". Minimalist style, clean frame, centered hero bottle and tea glass, soft studio lighting, realistic material textures, elegant condensation details, generous negative space, premium brand visual language, cinematic light and shadow, refined packaging typography, and ultra-detailed finish. Make it feel like a luxury beverage campaign that could run in a subway lightbox or fashion magazine.',
  },
  {
    id: 'risograph-city',
    title: 'SHIFT / 双墨城市印刷',
    category: 'illustration',
    image: '/images/risograph-urban-landscape.png',
    ratio: 'portrait',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#ff5a91',
    prompt: 'An urban landscape illustration created in the style of a two-color Risograph print. Limit the palette to fluorescent pink and teal blue, with dark navy where the inks overlap. Use grainy tactile texture, visible halftones, and intentional color misregistration. Show a high-contrast city street with fire escapes and power lines, using dot-pattern density for light and shadow. Flat shapes, bold silhouettes, indie DIY zine mood. Print the text "SHIFT" in the bottom corner in a distorted, ink-heavy typeface.',
  },
  {
    id: 'holographic-stickers',
    title: 'Cyber Explorer / 贴纸组',
    category: 'illustration',
    image: '/images/holographic-sticker-badge.png',
    ratio: 'square',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#8d7cff',
    prompt: 'A collection of five high-quality die-cut sticker designs arranged on a dark carbon-fiber background. The central circular badge features a stylized astronaut helmet with the text "EXPLORE". Other stickers include a retro rocket, a ringed planet and a lightning bolt. Neo-traditional sticker art with thick white borders, electric purple, cyan and neon yellow, holographic rainbow sheen, glossy plastic highlights and subtle peeling shadows.',
  },
  {
    id: 'anime-rain',
    title: 'Rainy Bus Stop / 蓝调时刻',
    category: 'anime',
    image: '/images/anime-rainy-bus-stop-mirror.png',
    ratio: 'portrait',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#8fb6ff',
    prompt: 'Create a portrait anime key visual of an adult woman, age 25, posing in a convex traffic safety mirror beside a rainy roadside bus stop at blue hour. Show both the round mirror reflection and the real street around it: wet asphalt, umbrellas, blurred bus headlights, a timetable sign and glowing convenience-store windows. Camel duffle coat, plaid skirt, scarf and ankle boots. High-end anime rendering, delicate rain highlights, crisp line art, luminous eyes, realistic mirror distortion and a cozy rainy-city atmosphere.',
  },
  {
    id: 'synth-moon',
    title: 'Synth Moon Crew / 3×3',
    category: 'anime',
    image: '/images/synth-moon-crew-grid.png',
    ratio: 'square',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#68f4df',
    prompt: 'Create a square cyberpunk alien nightclub catalog sheet called "SYNTH MOON CREW". Layout: a clean 3×3 grid of nine cards with thin chrome borders. Each card shows a different original alien or android nightlife character: glass-horn DJ, koi-scale bartender, moth-wing hacker, chrome geisha bassist, jellyfish courier, neon priestess, reptile fashion model, vending-machine oracle, and masked dancer. Late-90s anime cyberpunk aesthetic, black background, fluorescent rim lights and glossy materials.',
  },
  {
    id: 'mecha-fortress',
    title: 'Sea Fortress / 机甲少女',
    category: 'anime',
    image: '/images/cyberpunk-mecha.png',
    ratio: 'landscape',
    author: 'EvoLinkAI',
    sourceLabel: 'GitHub',
    source: 'https://github.com/EvoLinkAI/awesome-gpt-image-2-prompts',
    accent: '#43d7e7',
    prompt: 'Cinematic anime key visual of an original mecha pilot standing on a rusted steel platform over dark water, a massive rail cannon resting on her shoulder. Matte gunmetal exoskeleton, exposed hydraulic joints, glowing cyan coolant lines, wind-whipped ash-white ponytail and oil-stained hangar jacket. Behind her, a derelict sea-city of colossal bone-white towers, ring constructs and skeletal gantries disappears into fog at dusk. Cold teal ambience, warm distant sodium glow, hard backlight, volumetric rays, wet specular highlights, 35mm anamorphic lens, desaturated oceanic palette with rust accents, 16:9.',
  },
  {
    id: 'watch-exploded',
    title: 'Meridian 8 / 爆炸图',
    category: 'technical',
    image: '/images/mechanical-watch-exploded-view.png',
    ratio: 'square',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#e4bc67',
    prompt: 'Create a premium technical exploded-view illustration of a fictional mechanical wristwatch called the Meridian 8, centered on a dark slate background with fine blueprint grid accents. Separate sapphire crystal, dial, hands, chapter ring, movement plates, escapement, balance wheel, mainspring barrel, case, crown and leather strap vertically with precise spacing. Use brushed steel, brass, ruby jewel accents and deep navy details. Add crisp numbered callouts, refined material realism and exact labeling suitable for an industrial design plate.',
  },
  {
    id: 'keyboard-exploded',
    title: 'LUMEN K65 / 工业拆解',
    category: 'technical',
    image: '/images/mechanical-keyboard-exploded-assembly.png',
    ratio: 'wide',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#62ddd0',
    prompt: 'Design a crisp exploded-view product illustration of a custom mechanical keyboard named LUMEN K65, shown in three-quarter perspective on a pale gray background. Separate keycaps, switches, plate, PCB, foam, gasket mounts, case top, battery, rotary knob and case bottom. Use anodized silver, matte black, translucent smoke keycaps and small teal accents. Add clean callouts for PBT Keycaps, Linear Switch, Aluminum Plate, Poron Foam, USB-C and Encoder Knob, with exact dimensions and industrial-design presentation quality.',
  },
  {
    id: 'geological-strata',
    title: 'Solterra Basin / 地质剖面',
    category: 'technical',
    image: '/images/geological-strata-cross-section.png',
    ratio: 'wide',
    author: 'Curated',
    sourceLabel: 'GitHub',
    source: SOURCE_REPO.url,
    accent: '#e66f45',
    prompt: 'Produce a detailed geological cross-section poster of layered earth strata cutting through a fictional canyon basin. Use sandstone beige, iron oxide red, shale gray, limestone cream, basalt charcoal and muted green vegetation. Show differentiated layers, a fault line, aquifer, fossil-bearing beds and volcanic intrusion. Add crisp labels including "Geological Cross-Section", "Solterra Basin", "Sandstone", "Shale", "Limestone", "Coal Seam", "Aquifer" and "Basalt Dike", with a 0–500 m vertical scale.',
  },
  {
    id: 'isometric-cafe',
    title: 'Cafe District / 微缩街区',
    category: 'isometric',
    image: '/images/isometric-cafe.png',
    ratio: 'square',
    author: 'EvoLinkAI',
    sourceLabel: 'GitHub',
    source: 'https://github.com/EvoLinkAI/awesome-gpt-image-2-prompts',
    accent: '#e9b48c',
    prompt: 'A detailed isometric 3D miniature scene of a two-block cafe district, precise 30-degree perspective. A corner cafe with outdoor seating, bookstore, bakery window, bicycle, small fountain, planters, tiny trees, food cart and stylized pedestrians. Soft upper-left ambient light, pastel muted palette of terracotta, cream, sage and dusty blue, subtle ambient occlusion, high-detail miniature texturing. Flat soft-cream background, no ground-plane shadow, floating like a diorama.',
  },
  {
    id: 'coffee-flow',
    title: 'Coffee Machine / 运作流程',
    category: 'technical',
    image: '/images/coffee-infographic.png',
    ratio: 'portrait',
    author: 'OpenAI',
    sourceLabel: 'OpenAI Cookbook',
    source: 'https://github.com/openai/openai-cookbook/blob/main/examples/multimodal/image-gen-models-prompting-guide.ipynb',
    accent: '#f0bb70',
    prompt: 'Create a detailed infographic of the functioning and flow of an automatic coffee machine like a Jura. From bean basket, to grinding, to scale, water tank, boiler, etc. I would like to understand technically and visually the flow.',
  },
  {
    id: 'urban-metabolism',
    title: 'Urban Metabolism / 城市生命系统',
    category: 'technical',
    image: '/images/case1.jpg',
    ratio: 'portrait',
    author: 'insight_express',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-1.md#case-1',
    accent: '#7cc4e8',
    prompt: 'Vertical 9:16 isometric cutaway infographic "城市生命系统图谱 / Urban Metabolism Atlas". Smart city from sky to bedrock: skyscrapers, streets, subway, utility tunnels, water/sewage/gas/heating pipes, fiber, data center, flood tanks, aquifers, geothermal wells, bedrock. Color-coded flows for power/water/data/traffic/waste. 12 numbered panels bilingual CN/EN: 能源/水循环/交通/数据/垃圾/建筑/公共服务/物流/气候韧性/生态/地质/治理看板. 24h timeline at bottom. Style: engineering white paper + scientific atlas, light paper bg, crisp lines, 8K. No cyberpunk, no gibberish text, must show both above AND below ground.',
  },
  {
    id: 'meteor-girl',
    title: 'Sky Mirror / 流星幻想',
    category: 'anime',
    image: '/images/case6.jpg',
    ratio: 'portrait',
    author: 'yi_xiao_jiu',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-1.md#case-6',
    accent: '#ad7dff',
    prompt: '参考图是角色人设图，为参考图的少女绘制一副日系唯美奇幻风格插画。【构图】这是一个宏大的中景日系奇幻插画构图，画面中心是完全保留了完整细节的可爱少女，她站立在无边的、如镜面般平滑的水面中心。天空呈现出高饱和度的粉紫与深蓝交织，一条耀眼的蓝色巨型流星划破天际，配合着边缘发光的瑰丽层云。女孩处于背光状态，形成一个暗调但依然清晰可辨其服装和紫色明亮眼眸的剪影，被流星和星空的边缘光细腻勾勒，她微微仰头，一只手轻轻张开。下方的水面完美、对称地反射出整个壮丽的星空、流星、云彩，以及女孩清晰的倒影，点缀着微小的发光点，营造出天人合一、空灵静谧的唯美梦境意境。生成图片比例 9:16，分辨率 4K。',
  },
  {
    id: 'vr-exploded',
    title: 'XR Anatomy / VR 爆炸图',
    category: 'technical',
    image: '/images/case17.jpg',
    ratio: 'portrait',
    author: '@wory37303852',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-1.md#case-17',
    accent: '#8f9cff',
    prompt: 'Create an exploded-view product diagram poster of a next-generation VR headset. Use a clean high-tech 3D render with studio lighting, glowing accents and a soft purple-blue background. In the center, arrange nine distinct internal layers vertically: outer shell, camera sensors, motherboard and chip, pancake lenses, internal frame, battery packs, side straps, top strap and facial-interface cushion. Add eight precise callout labels on both sides, a bold product header and a compact technical footer. The layout should feel like premium industrial-design communication: exact spacing, highly legible typography, credible materials and clearly separated components.',
  },
  {
    id: 'snack-technical',
    title: 'Snack Anatomy / 品牌技术图',
    category: 'product',
    image: '/images/case310.jpg',
    ratio: 'square',
    author: '@TechieBySA',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-2.md#case-310',
    accent: '#ef4b35',
    prompt: 'Create a branded technical infographic of a snack, combining a photoreal product render with technical annotation overlays. On a pure white studio background, use black architectural-sketch linework with strategic brand-color accents. Include component labels, an internal cross-section showing layers, measurements and specifications, material callouts with composition and quantities, function arrows, sustainability notes and a small schematic. Keep the real product clearly visible, the annotations precise but slightly hand-drawn, and the negative space balanced. Premium food-engineering aesthetic, 1080×1080, ultra-crisp, social-feed optimized, no watermark.',
  },
  {
    id: 'xian-map',
    title: 'Xi’an / 手绘城市地图',
    category: 'illustration',
    image: '/images/case331.png',
    ratio: 'landscape',
    author: '苍何原创实测',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-2.md#case-331',
    accent: '#e9a557',
    prompt: '生成一张手绘水彩风格的「西安」城市地图，包含当地特色美食、地标建筑及城市特色。',
  },
  {
    id: 'apple-nature',
    title: 'Nature Keynote / 自然科普',
    category: 'technical',
    image: '/images/case339.jpg',
    ratio: 'portrait',
    author: '@berryxia',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-2.md#case-339',
    accent: '#67a966',
    prompt: '生成一张 9:16 竖版高级自然科普海报，采用极简、纯白、现代的 Apple keynote 式产品发布视觉语言。主体动物被极度放大，占画面 50% 到 70%，具有可信的毛发、鳞片、甲壳或羽毛细节与柔和棚拍阴影。顶部左侧放置巨大中文物种名、克制副标题、英文名与分布信息。底部仅用四列极简 icon + 标题 + 短说明，通过极细浅灰竖线分隔。不要卡片、厚边框、复杂网格、旧纸背景或多余装饰。整体高级、干净、克制，信息少而准，2K 高清，主体锐利，科学展示感强。',
  },
  {
    id: 'rio-diorama',
    title: 'RIO / 旅行票据纸雕',
    category: 'illustration',
    image: '/images/case527.jpg',
    ratio: 'portrait',
    author: '@john_my07',
    sourceLabel: 'GitHub',
    source: 'https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-2.md#case-527',
    accent: '#57b7cd',
    prompt: 'Create a highly detailed, photorealistic miniature travel-poster diorama inspired by Rio de Janeiro, arranged as a handcrafted 3D paper scene on a warm ivory textured background. A realistic hand holds a vintage Brazilian travel ticket on the left; from behind it, a miniature Rio landscape rises like an intricate pop-up diorama. Make Christ the Redeemer the dominant landmark above lush mountains, colorful streets, a yellow taxi, palm trees, pedestrians and Copacabana beach. Surround the scene with charcoal and muted-sepia travel sketches, handwritten notes, map markings and postage details. Blend realistic miniature photography with vintage travel-journal design, tactile fibers, warm studio light, gentle shadows and a sophisticated cream, green, ocean-blue and Brazilian-yellow palette. Vertical 4:5, editorial 8K detail.',
  },
]

function replaceArgumentDefaults(value) {
  return value.replace(
    /\{argument\s+name=(?:"([^"]*)"|'([^']*)')\s+default=(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)')\}/gi,
    (_match, _doubleName, _singleName, doubleDefault, singleDefault) => (doubleDefault ?? singleDefault ?? '').replace(/\\(["'])/g, '$1'),
  )
}

function normalizePlaceholders(value) {
  return value
    .replace(/\{([A-Z][A-Z0-9 _-]*)\}/g, '[$1]')
    .replace(/\[([A-Z][A-Z0-9 _-]+)\]/g, (_match, name) => `[${name.trim().replace(/\s+/g, '_')}]`)
}

function isEditableBracket(content, fullWidth) {
  const name = content.trim()
  if (!name || /^(?:中文|English)$/i.test(name)) return false
  if (fullWidth) return true
  return /^[A-Z][A-Z0-9 _-]*$/.test(name) || /自定义|请填写|请输入|可修改|替换为/.test(name)
}

function normalizeVariableKey(value) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function collectStringValues(value, output) {
  if (typeof value === 'string') {
    output.push(value)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectStringValues(entry, output))
    return
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((entry) => collectStringValues(entry, output))
  }
}

function extractPromptVariables(prompt, rawPrompt) {
  const variables = new Map()
  const argumentPattern = /\{argument\s+name=(?:"([^"]*)"|'([^']*)')\s+default=(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)')\}/gi
  const raw = String(rawPrompt || '')
  const argumentSources = [raw]
  const parsedRaw = parseJsonObject(raw)
  if (parsedRaw?.parsed) collectStringValues(parsedRaw.parsed, argumentSources)
  else if (raw.includes('\\"')) argumentSources.push(raw.replace(/\\"/g, '"'))

  for (const source of argumentSources) {
    for (const match of source.matchAll(argumentPattern)) {
      const label = (match[1] ?? match[2] ?? '').trim()
      const defaultValue = (match[3] ?? match[4] ?? '').replace(/\\(["'\\])/g, '$1')
      if (!label || variables.has(`argument:${label}`)) continue
      variables.set(`argument:${label}`, {
        key: `argument:${label}`,
        label,
        defaultValue,
        kind: 'argument',
      })
    }
  }

  // Some prompt templates use a descriptive field followed by a long bracket value,
  // e.g. `Accent color: [red / orange / cobalt blue]`. Capture these first so the
  // field name becomes the editable label instead of exposing the whole value as one.
  const fieldBracketPattern = /(?:^|\n)\s*([A-Za-z][A-Za-z0-9 _-]{1,48})\s*:\s*(\[[^\]\n]{1,160}\]|【[^】\n]{1,160}】)(?!\()/g
  for (const match of String(prompt || '').matchAll(fieldBracketPattern)) {
    const fieldName = match[1].trim()
    const token = match[2]
    const value = token.slice(1, -1).trim()
    const normalizedKey = normalizeVariableKey(fieldName)
    if (!normalizedKey || !value || variables.has(`placeholder:${normalizedKey}`)) continue
    variables.set(`placeholder:${normalizedKey}`, {
      key: `placeholder:${normalizedKey}`,
      label: fieldName,
      defaultValue: value,
      token,
      kind: 'placeholder',
    })
  }

  const bracketPattern = /\[([^\]\n]{1,160})\]|【([^】\n]{1,160})】/g
  for (const match of String(prompt || '').matchAll(bracketPattern)) {
    const fullWidth = match[2] != null
    const label = (match[1] ?? match[2] ?? '').trim()
    if (!isEditableBracket(label, fullWidth)) continue
    const key = `placeholder:${label}`
    if (variables.has(key)) continue
    variables.set(key, {
      key,
      label: label.replace(/_/g, ' '),
      defaultValue: label,
      token: match[0],
      kind: 'placeholder',
    })
  }

  return [...variables.values()]
}

function labelKey(key) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatStructuredPrompt(value, depth = 0) {
  if (value == null) return ''
  if (typeof value === 'string') return normalizePlaceholders(replaceArgumentDefaults(value)).trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  const indent = '  '.repeat(depth)
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        const formatted = formatStructuredPrompt(entry, depth + 1)
        return formatted ? `${indent}- ${formatted}` : ''
      })
      .filter(Boolean)
      .join('\n')
  }
  return Object.entries(value)
    .map(([key, entry]) => {
      const formatted = formatStructuredPrompt(entry, depth + 1)
      if (!formatted) return ''
      if (typeof entry === 'object' && entry !== null) return `${indent}${labelKey(key)}:\n${formatted}`
      return `${indent}${labelKey(key)}: ${formatted}`
    })
    .filter(Boolean)
    .join('\n')
}

function parseJsonObject(value) {
  const start = value.indexOf('{')
  const end = value.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    return { parsed: JSON.parse(value.slice(start, end + 1)), prefix: value.slice(0, start).trim(), suffix: value.slice(end + 1).trim() }
  } catch {
    return null
  }
}

function extractPromptValue(value) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof value.prompt === 'string') return value.prompt
  return ''
}

function formatParsedPrompt(value) {
  const promptValue = extractPromptValue(value)
  if (!promptValue) return formatStructuredPrompt(value)
  const metadata = Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'prompt'))
  const metadataText = formatStructuredPrompt(metadata)
  return [promptValue, metadataText].filter(Boolean).join('\n\n')
}

function decodeLooseString(value) {
  return value.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
}

function formatLooseStructuredPrompt(value) {
  const text = value.trim()
  const negativeMatch = text.match(/,\s*"negative_prompt"\s*:\s*"([\s\S]*)"\s*}\s*$/)
  if (negativeMatch) {
    const main = text
      .slice(0, negativeMatch.index)
      .replace(/^\s*\{\s*/, '')
      .replace(/"\s*$/, '')
      .trim()
    return `${decodeLooseString(main)}\n\nNegative Prompt:\n${decodeLooseString(negativeMatch[1])}`
  }
  const promptMatch = text.match(/"prompt"\s*:\s*"([\s\S]*?)"\s*(?:,|})/)
  if (promptMatch) return decodeLooseString(promptMatch[1])
  return decodeLooseString(text.replace(/^\s*\{\s*/, '').replace(/\s*}\s*$/, '').replace(/"([\w-]+)"\s*:/g, '$1:'))
}

function normalizePrompt(rawPrompt) {
  const raw = String(rawPrompt ?? '').trim()
  const hadArguments = /\{argument\s+name=/i.test(raw)
  const hadFieldPlaceholders = /(?:^|\n)\s*[A-Za-z][A-Za-z0-9 _-]{1,48}\s*:\s*(?:\[[^\]\n]{1,160}\]|【[^】\n]{1,160}】)(?!\()/m.test(raw)
  const hadPlaceholders = /\{[A-Z][A-Z0-9 _-]*\}|\[[A-Z][A-Z0-9 _-]+\]|\[(?:[^\]\n]*(?:自定义|请填写|请输入|可修改|替换为)[^\]\n]*)\]|【[^】\n]{1,160}】/.test(raw) || hadFieldPlaceholders
  const hadBilingualMarkers = /\[(?:中文|English)\]/i.test(raw)
  const cleaned = replaceArgumentDefaults(raw).replace(
    /\s*This prompt is reconstructed from the creator's public post description;\s*use the uploaded photo as the source image\.?/i,
    '\nUse the uploaded photo as the source image.',
  )
  const sections = cleaned.split(/\[(中文|English)\]/i).filter((part) => part.trim())
  const bilingual = sections.length > 1 && sections.some((part) => /^(中文|English)$/i.test(part.trim()))
  const chunks = []

  if (bilingual) {
    for (let index = 0; index < sections.length; index += 2) {
      const language = sections[index]?.trim()
      const content = sections[index + 1]?.trim()
      if (!content) continue
      const parsed = parseJsonObject(content)
      const text = parsed ? formatParsedPrompt(parsed.parsed) : formatLooseStructuredPrompt(content)
      if (text) chunks.push(`${language}\n${text}`)
    }
  } else {
    const parsed = parseJsonObject(cleaned)
    if (parsed?.parsed) {
      const body = formatParsedPrompt(parsed.parsed)
      const prefix = parsed.prefix.replace(/^@+/, '').trim()
      chunks.push([prefix, body, parsed.suffix].filter(Boolean).join('\n\n'))
    } else {
      // Some scraped posts contain JSON-like keys but are not valid JSON. Keep their wording,
      // while removing wrapper punctuation so the prompt remains editable and copyable.
      chunks.push(formatLooseStructuredPrompt(cleaned))
    }
  }

  const text = normalizePlaceholders(chunks.join('\n\n')).replace(/\n{3,}/g, '\n\n').trim()
  let status = 'clean'
  if (/reconstructed|重建/i.test(raw)) status = 'reconstructed'
  else if (hadArguments || hadPlaceholders) status = 'template'
  else if (hadBilingualMarkers || bilingual) status = 'bilingual'
  else if (parseJsonObject(cleaned)) status = 'structured'
  return { text: text || raw, status }
}

const LOCAL_IMAGE_DIMENSIONS = {
  '/images/anime-rainy-bus-stop-mirror.png': { width: 1024, height: 1536 },
  '/images/aurora-oolong-poster.png': { width: 1024, height: 1536 },
  '/images/case1.jpg': { width: 941, height: 1672 },
  '/images/case17.jpg': { width: 800, height: 1200 },
  '/images/case310.jpg': { width: 1080, height: 1080 },
  '/images/case331.png': { width: 1536, height: 1024 },
  '/images/case339.jpg': { width: 1280, height: 5676 },
  '/images/case527.jpg': { width: 1122, height: 1402 },
  '/images/case6.jpg': { width: 1080, height: 1920 },
  '/images/chess-midgame.png': { width: 1536, height: 1024 },
  '/images/coffee-infographic.png': { width: 1024, height: 1536 },
  '/images/cyberpunk-mecha.png': { width: 1536, height: 1024 },
  '/images/food-salad-explosion.png': { width: 1024, height: 1536 },
  '/images/geological-strata-cross-section.png': { width: 2048, height: 1152 },
  '/images/handwritten-notebook.png': { width: 1536, height: 1024 },
  '/images/holographic-sticker-badge.png': { width: 1024, height: 1024 },
  '/images/isometric-cafe.png': { width: 1024, height: 1024 },
  '/images/mechanical-keyboard-exploded-assembly.png': { width: 2048, height: 1152 },
  '/images/mechanical-watch-exploded-view.png': { width: 1024, height: 1024 },
  '/images/panorama-jungle.png': { width: 2048, height: 1152 },
  '/images/photoreal-subway.png': { width: 1536, height: 1024 },
  '/images/product-chocolate-wafer.png': { width: 1024, height: 1536 },
  '/images/prompt-signal-home.jpg': { width: 1912, height: 925 },
  '/images/risograph-urban-landscape.png': { width: 1024, height: 1536 },
  '/images/synth-moon-crew-grid.png': { width: 1024, height: 1024 },
}

function preparePrompts(items) {
  return items.map((item, index) => {
    const rawPrompt = item.prompt ?? ''
    const normalized = normalizePrompt(rawPrompt)
    const localDim = LOCAL_IMAGE_DIMENSIONS[item.image]
    const width = item.width || localDim?.width
    const height = item.height || localDim?.height
    const parsedCreatedAt = item.createdAt ? Date.parse(item.createdAt) : NaN
    return {
      ...item,
      width,
      height,
      prompt: normalized.text,
      rawPrompt,
      promptVariables: extractPromptVariables(normalized.text, rawPrompt),
      promptStatus: item.promptStatus || normalized.status,
      // Curated timestamps let cross-source highlights appear first in the default newest view.
      addedOrder: Number.isFinite(parsedCreatedAt) ? parsedCreatedAt : index,
    }
  })
}

let promptCatalogPromise

export function loadPromptCatalog() {
  if (!promptCatalogPromise) {
    promptCatalogPromise = Promise.all([
      import('./cases.generated.json').then((module) => module.default),
      import('./zhidawang.generated.json').then((module) => module.default),
      import('./x.hot.generated.json').then((module) => module.default),
    ]).then(([generatedCases, zhidawangCases, hotXCases]) => (
      preparePrompts([...featuredPrompts, ...generatedCases, ...zhidawangCases, ...hotXCases])
    ))
  }
  return promptCatalogPromise
}
