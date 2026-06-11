import localChannels from './channelData'

const IPTV_DATA_URL = '/data/iptv-org.json'

let iptvPayload = null
let iptvLoadPromise = null
let mergedChannels = null

export function getLocalChannels() {
  return localChannels.map((channel) => ({ ...channel, source: channel.source || 'srg' }))
}

export async function loadIptvChannels({ force = false } = {}) {
  if (iptvPayload && !force) return iptvPayload
  if (iptvLoadPromise && !force) return iptvLoadPromise

  iptvLoadPromise = fetch(IPTV_DATA_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat data IPTV (HTTP ${response.status})`)
      }
      return response.json()
    })
    .then((data) => {
      iptvPayload = {
        syncedAt: data.syncedAt,
        source: data.source,
        total: data.total || data.channels?.length || 0,
        categories: data.categories || [],
        channels: (data.channels || []).map((channel) => ({
          ...channel,
          source: 'iptv-org',
        })),
      }
      mergedChannels = null
      return iptvPayload
    })
    .catch((error) => {
      iptvLoadPromise = null
      throw error
    })

  return iptvLoadPromise
}

export function getIptvChannels() {
  return iptvPayload?.channels || []
}

export function getIptvCategories() {
  return iptvPayload?.categories || []
}

export function getMergedChannels() {
  if (mergedChannels) return mergedChannels

  const local = getLocalChannels()
  const iptv = getIptvChannels()
  const localUrls = new Set(local.map((channel) => channel.url))

  mergedChannels = [
    ...local,
    ...iptv.filter((channel) => !localUrls.has(channel.url)),
  ]

  return mergedChannels
}

export function getAllCategories() {
  const categories = new Set()
  getMergedChannels().forEach((channel) => {
    if (channel.category) categories.add(channel.category)
  })
  return [...categories].sort((a, b) => a.localeCompare(b, 'id'))
}

export function findChannelById(id) {
  if (!id) return null
  const local = getLocalChannels().find((channel) => channel.id === id)
  if (local) return local
  return getIptvChannels().find((channel) => channel.id === id) || null
}

export function findChannelIndex(id) {
  return getMergedChannels().findIndex((channel) => channel.id === id)
}

export function getChannelsPage({
  page = 1,
  pageSize = 48,
  category = '',
  query = '',
  excludeCategory = '',
} = {}) {
  let list = getMergedChannels()

  if (category) {
    list = list.filter((channel) => channel.category?.toLowerCase() === category.toLowerCase())
  }

  if (excludeCategory) {
    list = list.filter((channel) => channel.category !== excludeCategory)
  }

  if (query.trim()) {
    const term = query.trim().toLowerCase()
    list = list.filter((channel) =>
      `${channel.name} ${channel.category}`.toLowerCase().includes(term),
    )
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export function getChannelCount() {
  return getMergedChannels().length
}

export function isIptvLoaded() {
  return Boolean(iptvPayload)
}
