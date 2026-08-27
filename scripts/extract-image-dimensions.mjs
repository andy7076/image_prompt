import fs from 'fs'
import path from 'path'

function parseDimensions(buf) {
  if (!buf || buf.length < 10) return null
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  }
  // GIF
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
  }
  // WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const type = buf.toString('ascii', 12, 16)
    if (type === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
    if (type === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24]
      return { width: 1 + (((b0 & 0x3f) << 8) | buf[20]), height: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) }
    }
    if (type === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) }
  }
  // JPEG
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let offset = 2
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) { offset++; continue }
      const marker = buf[offset + 1]
      if (marker === 0xD9 || marker === 0xDA) break
      const len = buf.readUInt16BE(offset + 2)
      if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
        return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) }
      }
      offset += 2 + len
    }
  }
  return null
}

async function getImageDimensions(imageUrl) {
  try {
    if (imageUrl.startsWith('/')) {
      const localPath = path.join('./public', imageUrl)
      if (fs.existsSync(localPath)) {
        const buf = fs.readFileSync(localPath)
        return parseDimensions(buf)
      }
    }
    // Remote fetch
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { Range: 'bytes=0-65535' },
    })
    clearTimeout(timer)
    if (!res.ok && res.status !== 206) {
      const fullRes = await fetch(imageUrl)
      const arrayBuf = await fullRes.arrayBuffer()
      return parseDimensions(Buffer.from(arrayBuf))
    }
    const arrayBuf = await res.arrayBuffer()
    let dims = parseDimensions(Buffer.from(arrayBuf))
    if (!dims) {
      const fullRes = await fetch(imageUrl)
      const fullBuf = await fullRes.arrayBuffer()
      dims = parseDimensions(Buffer.from(fullBuf))
    }
    return dims
  } catch (err) {
    console.error(`Failed to fetch ${imageUrl}:`, err.message)
    return null
  }
}

async function run() {
  const casesPath = './src/cases.generated.json'
  const xHotPath = './src/x.hot.generated.json'
  const zhidawangPath = './src/zhidawang.generated.json'

  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'))
  const xHot = JSON.parse(fs.readFileSync(xHotPath, 'utf8'))
  const zhidawang = JSON.parse(fs.readFileSync(zhidawangPath, 'utf8'))

  const allItems = [...cases, ...xHot, ...zhidawang]
  const uniqueUrls = [...new Set(allItems.map((item) => item.image))]

  console.log(`Extracting dimensions for ${uniqueUrls.length} unique images...`)

  const dimensionsMap = new Map()
  const CONCURRENCY = 25
  let index = 0

  async function worker() {
    while (index < uniqueUrls.length) {
      const i = index++
      const url = uniqueUrls[i]
      const dims = await getImageDimensions(url)
      if (dims && dims.width > 0 && dims.height > 0) {
        dimensionsMap.set(url, { width: dims.width, height: dims.height })
      }
      if (i % 50 === 0 || i === uniqueUrls.length - 1) {
        console.log(`Progress: ${i + 1} / ${uniqueUrls.length}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  console.log(`Successfully resolved dimensions for ${dimensionsMap.size} / ${uniqueUrls.length} images`)

  const injectDimensions = (list) => {
    return list.map((item) => {
      const dims = dimensionsMap.get(item.image)
      if (dims) {
        return { ...item, width: dims.width, height: dims.height }
      }
      return item
    })
  }

  const updatedCases = injectDimensions(cases)
  const updatedXHot = injectDimensions(xHot)
  const updatedZhidawang = injectDimensions(zhidawang)

  fs.writeFileSync(casesPath, JSON.stringify(updatedCases, null, 2))
  fs.writeFileSync(xHotPath, JSON.stringify(updatedXHot, null, 2))
  fs.writeFileSync(zhidawangPath, JSON.stringify(updatedZhidawang, null, 2))

  console.log('Saved updated JSON files with width and height!')
}

run()
