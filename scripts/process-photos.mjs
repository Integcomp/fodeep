import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const rawDir = path.resolve('public/photos/raw')
const outDir = path.resolve('public/photos')

fs.mkdirSync(outDir, { recursive: true })

async function edgeFloodRemoveBg(input, output, { threshold = 36, minLuma = 70 } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

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

  const alpha = new Uint8Array(w * h)
  alpha.fill(255)
  for (let p = 0; p < w * h; p++) {
    if (isBg[p]) alpha[p] = 0
  }

  const feathered = alpha.slice()
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (alpha[y * w + x] === 0) continue
      let near = 0
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          if (alpha[ny * w + nx] === 0) near++
        }
      }
      if (near) feathered[y * w + x] = Math.max(0, 255 - near * 16)
    }
  }

  for (let p = 0; p < w * h; p++) {
    data[p * c + 3] = Math.min(data[p * c + 3], feathered[p])
  }

  await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(output)
}

async function skyKeyRemoveBg(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

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
    const edgeBias = y < h * 0.55 || x < 18 || x > w - 18
    if (edgeBias) data[i + 3] = 0
  }

  await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(output)
}

async function copyJpeg(input, output) {
  await sharp(input).jpeg({ quality: 90 }).toFile(output)
}

const raw = (name) => path.join(rawDir, name)
const dest = (name) => path.join(outDir, name)

await copyJpeg(raw('post_apr03.jpg'), dest('gallery-studio.jpg'))
await copyJpeg(raw('post_apr01.jpg'), dest('gallery-live.jpg'))
await copyJpeg(raw('post_jan08.jpg'), dest('gallery-novocaine.jpg'))
await copyJpeg(raw('post_jan29.jpg'), dest('gallery-flyer.jpg'))
await copyJpeg(raw('post_feb17.jpg'), dest('gallery-crew.jpg'))
await copyJpeg(raw('post_feb23.jpg'), dest('gallery-outdoors.jpg'))
await copyJpeg(raw('post_dec26.jpg'), dest('gallery-token.jpg'))
await copyJpeg(raw('profile.jpg'), dest('gallery-profile.jpg'))

await sharp(raw('post_jan29.jpg'))
  .extract({ left: 0, top: 0, width: 494, height: 300 })
  .jpeg({ quality: 92 })
  .toFile(dest('crop-flyer-group.jpg'))

await sharp(raw('post_apr01.jpg'))
  .extract({ left: 40, top: 20, width: 560, height: 420 })
  .jpeg({ quality: 92 })
  .toFile(dest('crop-live.jpg'))

await sharp(raw('post_dec26.jpg'))
  .extract({ left: 40, top: 40, width: 430, height: 500 })
  .jpeg({ quality: 92 })
  .toFile(dest('crop-token.jpg'))

await sharp(raw('post_apr03.jpg'))
  .extract({ left: 80, top: 10, width: 480, height: 340 })
  .jpeg({ quality: 92 })
  .toFile(dest('crop-studio.jpg'))

await skyKeyRemoveBg(raw('post_feb23.jpg'), dest('cutout-outdoors.png'))

await edgeFloodRemoveBg(raw('post_apr03.jpg'), dest('cutout-studio.png'), {
  threshold: 32,
  minLuma: 85,
})

await edgeFloodRemoveBg(raw('profile.jpg'), dest('cutout-profile.png'), {
  threshold: 40,
  minLuma: 80,
})

console.log('Processed photos into public/photos')
