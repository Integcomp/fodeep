import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const hero = path.resolve('public/photos/hero-group.jpg')
const artistsDir = path.resolve('public/photos/artists')
const galleryDir = path.resolve('public/photos/gallery')

fs.mkdirSync(artistsDir, { recursive: true })
fs.mkdirSync(galleryDir, { recursive: true })

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

const crops = [
  { id: 'scurvy', left: 0, top: 30, width: 250, height: 720 },
  { id: 'mike', left: 210, top: 20, width: 260, height: 730 },
  { id: 'doctorleyva', left: 450, top: 10, width: 290, height: 740 },
  { id: 'jsmoke760', left: 700, top: 25, width: 324, height: 725 },
]

for (const crop of crops) {
  const rawPath = path.join(artistsDir, `${crop.id}-raw.jpg`)
  const cutoutPath = path.join(artistsDir, `${crop.id}.png`)
  await sharp(hero).extract(crop).jpeg({ quality: 92 }).toFile(rawPath)
  await edgeFloodRemoveBg(rawPath, cutoutPath, { threshold: 42, minLuma: 78 })
}

const gallerySources = [
  ['public/photos/gallery-live.jpg', 'live.jpg'],
  ['public/photos/gallery-studio.jpg', 'studio.jpg'],
  ['public/photos/gallery-crew.jpg', 'crew.jpg'],
  ['public/photos/raw/post_dec26.jpg', 'token-live.jpg'],
  ['public/photos/raw/post_feb17.jpg', 'podcast.jpg'],
  ['public/photos/crop-flyer-group.jpg', 'flyer.jpg'],
]

for (const [src, name] of gallerySources) {
  const full = path.resolve(src)
  if (fs.existsSync(full)) {
    await sharp(full).jpeg({ quality: 88 }).toFile(path.join(galleryDir, name))
  }
}

console.log('Processed artist cutouts and gallery set')
