import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const assetsDir = path.resolve('/Users/jesus/.cursor/projects/Users-jesus-fodeep/assets')
const artistsDir = path.resolve('public/photos/artists')
const galleryDir = path.resolve('public/photos/gallery')
const sourcesDir = path.resolve('public/photos/sources')

fs.mkdirSync(artistsDir, { recursive: true })
fs.mkdirSync(galleryDir, { recursive: true })
fs.mkdirSync(sourcesDir, { recursive: true })

async function edgeFloodRemoveBg(input, output, { threshold = 38, minLuma = 72 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  const c = info.channels
  const idx = (x, y) => (y * w + x) * c
  const luma = (i) => (data[i] + data[i + 1] + data[i + 2]) / 3
  const dist = (i, j) => {
    const dr = data[i] - data[j]
    const dg = data[i + 1] - data[j + 1]
    const db = data[i + 2] - data[j + 2]
    return Math.hypot(dr, dg, db)
  }

  const isBg = new Uint8Array(w * h)
  const q = []
  const seed = (x, y) => {
    const p = y * w + x
    if (isBg[p]) return
    if (luma(idx(x, y)) < minLuma) return
    isBg[p] = 1
    q.push(x, y)
  }

  for (let x = 0; x < w; x++) {
    seed(x, 0)
    seed(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    seed(0, y)
    seed(w - 1, y)
  }

  let qi = 0
  while (qi < q.length) {
    const x = q[qi++]
    const y = q[qi++]
    const i = idx(x, y)
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const p = ny * w + nx
      if (isBg[p]) continue
      const j = idx(nx, ny)
      if (luma(j) < minLuma) continue
      if (dist(i, j) < threshold) {
        isBg[p] = 1
        q.push(nx, ny)
      }
    }
  }

  for (let p = 0; p < w * h; p++) {
    if (isBg[p]) data[p * c + 3] = 0
  }

  await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } }).png().toFile(output)
}

async function skyKeyRemoveBg(input, output) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  const c = info.channels
  const isSky = (i) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    return b > 95 && b >= r + 12 && g > 80 && r < 190
  }

  for (let p = 0; p < w * h; p++) {
    const i = p * c
    if (!isSky(i)) continue
    const x = p % w
    const y = Math.floor(p / w)
    if (y < h * 0.6 || x < 20 || x > w - 20) data[i + 3] = 0
  }

  await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } }).png().toFile(output)
}

async function processArtist(id, assetName, bgFn, bgOpts) {
  const src = path.join(assetsDir, assetName)
  if (!fs.existsSync(src)) {
    console.warn(`Missing ${assetName}`)
    return
  }
  const prepared = path.join(sourcesDir, `${id}.jpg`)
  await sharp(src).rotate().jpeg({ quality: 92 }).toFile(prepared)
  const out = path.join(artistsDir, `${id}.png`)
  if (bgFn === 'sky') await skyKeyRemoveBg(prepared, out)
  else await edgeFloodRemoveBg(prepared, out, bgOpts)
}

const artistFiles = [
  {
    id: 'jsmoke760',
    file: '4Deep_zve_F___2710_-1aa4fa08-3685-4c95-9bfd-e83c6119d9a1.png',
    bg: 'edge',
    opts: { threshold: 34, minLuma: 68 },
  },
  {
    id: 'doctorleyva',
    file: '4Deep_zve_F___3177_-0bb065cf-6e07-4717-8d9d-9836d8a732fb.png',
    bg: 'edge',
    opts: { threshold: 28, minLuma: 38 },
  },
  {
    id: 'mike',
    file: 'FODEEP_1-737f67cc-f3a5-448a-aeae-44b08bf9c4bc.png',
    bg: 'sky',
  },
  {
    id: 'scurvy',
    file: 'A7407397-bf635296-628a-4379-9055-07f4b8b4165a.png',
    bg: 'sky',
  },
]

for (const a of artistFiles) {
  await processArtist(a.id, a.file, a.bg, a.opts)
}

const galleryFiles = [
  ['A7408096-70f420a8-4792-4248-be4d-2ce5935dd728.png', 'live.jpg', { wide: true }],
  ['FODEEP_7-180af396-8642-402c-927f-a05e8fe86c1f.png', 'studio-group.jpg', {}],
  ['925B3C5D-5310-4F6A-BA9D-B1095886FACE-75e1d5f4-c251-43db-befc-2f9364481880.png', 'cartoon.jpg', {}],
  ['A7407496-d99f103d-8a69-48ae-8078-c58b8e8ce752.png', 'car-wreck.jpg', {}],
  ['A7407694-2f607883-6734-45dd-a835-e6ca5bc8ffbb.png', 'studio-board.jpg', {}],
  ['A7407478-42556832-1c11-454f-995a-1b10bbee5cda.png', 'parking-lot.jpg', {}],
  ['A7407389-e5df1765-8ff2-4c83-ba58-da5f8860f641.png', 'stage.jpg', {}],
  ['FODEEP_5-a6261aee-bd6a-42ca-a907-6c5f4400e938.png', 'hennessy.jpg', {}],
]

for (const [asset, name] of galleryFiles) {
  const src = path.join(assetsDir, asset)
  if (!fs.existsSync(src)) continue
  await sharp(src).rotate().jpeg({ quality: 88 }).toFile(path.join(galleryDir, name))
}

const heroSrc = path.join(assetsDir, 'A7407533-71da248b-2e85-47b1-9657-2c7a57eda921.png')
if (fs.existsSync(heroSrc)) {
  await sharp(heroSrc).rotate().jpeg({ quality: 90 }).toFile(path.resolve('public/photos/hero-group.jpg'))
}

console.log('Processed uploaded artist photos and gallery')
