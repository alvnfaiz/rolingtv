/**
 * Unduh & parse playlist iptv-org → public/data/iptv-org.json
 * Sumber: https://iptv-org.github.io/iptv/index.m3u
 * Metadata: https://github.com/iptv-org/database/tree/master/data
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = join(ROOT, 'public', 'data', 'iptv-org.json')
const M3U_URL = 'https://iptv-org.github.io/iptv/index.m3u'

function extractAttr(line, key) {
  const re = new RegExp(`${key}="([^"]*)"`)
  const match = line.match(re)
  return match?.[1]?.trim() || ''
}

function makeId(tvgId, url) {
  if (tvgId) {
    return `iptv-${tvgId.replace(/[^a-zA-Z0-9._@-]+/g, '_')}`
  }
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  return `iptv-${hash}`
}

function normalizeCategory(groupTitle = '') {
  const primary = groupTitle.split(';').map((part) => part.trim()).find(Boolean)
  return primary || 'Lainnya'
}

function parseM3U(content) {
  const lines = content.split(/\r?\n/)
  const channels = []
  const seenUrls = new Set()
  let pending = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#EXTM3U')) continue

    if (line.startsWith('#EXTINF:')) {
      const name = line.includes(',') ? line.slice(line.lastIndexOf(',') + 1).trim() : 'Tanpa nama'
      pending = {
        name: name || 'Tanpa nama',
        tvgId: extractAttr(line, 'tvg-id'),
        logo: extractAttr(line, 'tvg-logo'),
        category: normalizeCategory(extractAttr(line, 'group-title')),
      }
      continue
    }

    if (line.startsWith('#')) continue

    if (!pending) continue
    if (!/^https?:\/\//i.test(line)) {
      pending = null
      continue
    }

    if (seenUrls.has(line)) {
      pending = null
      continue
    }
    seenUrls.add(line)

    channels.push({
      id: makeId(pending.tvgId, line),
      url: line,
      name: pending.name,
      category: pending.category,
      logo: pending.logo,
      source: 'iptv-org',
    })
    pending = null
  }

  return channels
}

async function main() {
  console.log(`Mengunduh ${M3U_URL} ...`)
  const response = await fetch(M3U_URL)
  if (!response.ok) {
    throw new Error(`Gagal unduh playlist: HTTP ${response.status}`)
  }

  const content = await response.text()
  const channels = parseM3U(content)
  const categories = [...new Set(channels.map((channel) => channel.category))].sort((a, b) => a.localeCompare(b))

  const payload = {
    syncedAt: new Date().toISOString(),
    source: M3U_URL,
    total: channels.length,
    categories,
    channels,
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(payload), 'utf8')

  console.log(`Selesai: ${channels.length} saluran → ${OUT_FILE}`)
  console.log(`Kategori unik: ${categories.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
