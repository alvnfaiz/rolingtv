export const categoryLabels = {
  'FIFA World Cup': 'Piala Dunia FIFA',
  Sports: 'Olahraga',
  Bangladesh: 'Bangladesh',
  Pakistan: 'Pakistan',
  Entertainment: 'Hiburan',
  Movies: 'Film',
  Music: 'Musik',
  Cartoon: 'Kartun',
  News: 'Berita',
  Documentary: 'Dokumenter',
}

export const routeLabels = {
  '': 'Beranda',
  search: 'Cari',
  favorites: 'Favorit',
  settings: 'Pengaturan',
  developer: 'Tentang',
  category: 'Kategori',
  live: 'Siaran Langsung',
}

export function getCategoryLabel(category = '') {
  return categoryLabels[category] || category
}

export function formatChannelCount(count) {
  return `${count} saluran siaran langsung`
}

export function formatPathLabel(pathname = '/') {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return routeLabels['']

  return parts
    .map((part, index) => {
      if (part === 'category' && parts[index + 1]) {
        return getCategoryLabel(decodeURIComponent(parts[index + 1]))
      }
      if (index > 0 && parts[index - 1] === 'category') return null
      return routeLabels[part] || decodeURIComponent(part)
    })
    .filter(Boolean)
    .join(' / ')
}

export function matchesSearch(channel, term) {
  const query = term.trim().toLowerCase()
  if (!query) return true

  const haystack = [
    channel.name,
    channel.category,
    getCategoryLabel(channel.category),
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}
