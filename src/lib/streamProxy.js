const M3U8_PROXY_BASE = 'https://qukgqfjlucrwbiyzkwha.supabase.co/functions/v1/m3u8-proxy/video/'

export function normalizeStreamUrl(url = '') {
  return url.replace(/&amp;/g, '&').trim()
}

export function isM3u8Stream(url = '') {
  const normalized = normalizeStreamUrl(url).toLowerCase()
  return normalized.includes('.m3u8') || normalized.includes('application/vnd.apple.mpegurl')
}

export function isProxiedStream(url = '') {
  return normalizeStreamUrl(url).includes('/functions/v1/m3u8-proxy/video/')
}

function encodeUrlForProxy(url) {
  const bytes = new TextEncoder().encode(url)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/=+$/, '')
}

/**
 * Ubah URL stream asli menjadi URL lewat proxy Supabase untuk HLS (.m3u8).
 * @see https://qukgqfjlucrwbiyzkwha.supabase.co/functions/v1/m3u8-proxy/video/
 */
export function toProxyStreamUrl(url = '') {
  const normalized = normalizeStreamUrl(url)
  if (!normalized) return normalized
  if (!isM3u8Stream(normalized)) return normalized
  if (isProxiedStream(normalized)) return normalized

  return `${M3U8_PROXY_BASE}${encodeUrlForProxy(normalized)}`
}

export function resolveStreamUrl(url = '', { useProxy = false } = {}) {
  const normalized = normalizeStreamUrl(url)
  if (!normalized) return normalized
  return useProxy ? toProxyStreamUrl(normalized) : normalized
}
