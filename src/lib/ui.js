export const FEATURED_CATEGORY = 'FIFA World Cup'

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
  General: 'Umum',
  Undefined: 'Lainnya',
  Lainnya: 'Lainnya',
  Shop: 'Belanja',
  Family: 'Keluarga',
  Kids: 'Anak-anak',
  Education: 'Edukasi',
  Culture: 'Budaya',
  Religious: 'Religi',
  Legislative: 'Legislatif',
  Business: 'Bisnis',
  Weather: 'Cuaca',
  Outdoor: 'Outdoor',
  Relax: 'Relaksasi',
  Series: 'Serial',
  Classic: 'Klasik',
  Comedy: 'Komedi',
  Cooking: 'Masak',
  Travel: 'Travel',
  Auto: 'Otomotif',
  Animation: 'Animasi',
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

/** Tab kategori: Piala Dunia tetap di ujung (bawah scroll), sisanya abjad. */
export function sortCategoriesForTabs(categories = []) {
  const rest = categories
    .filter((category) => category !== FEATURED_CATEGORY)
    .sort((a, b) => a.localeCompare(b, 'id'))

  if (categories.includes(FEATURED_CATEGORY)) {
    return [...rest, FEATURED_CATEGORY]
  }

  return rest
}

export function getFeaturedCategoryChannels(channels = []) {
  return channels.filter((channel) => channel.category === FEATURED_CATEGORY)
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
