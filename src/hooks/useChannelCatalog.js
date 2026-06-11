import { useCallback, useEffect, useState } from 'react'
import {
  getAllCategories,
  getChannelCount,
  getMergedChannels,
  isIptvLoaded,
  loadIptvChannels,
} from '../lib/channelRegistry'

export default function useChannelCatalog() {
  const [loading, setLoading] = useState(!isIptvLoaded())
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => {
    setVersion((value) => value + 1)
  }, [])

  useEffect(() => {
    if (isIptvLoaded()) {
      setLoading(false)
      return undefined
    }

    let active = true
    setLoading(true)
    setError('')

    loadIptvChannels()
      .then(() => {
        if (!active) return
        setLoading(false)
        refresh()
      })
      .catch((err) => {
        if (!active) return
        setLoading(false)
        setError(err?.message || 'Gagal memuat daftar IPTV')
      })

    return () => {
      active = false
    }
  }, [refresh])

  return {
    loading,
    error,
    channels: getMergedChannels(),
    categories: getAllCategories(),
    count: getChannelCount(),
    refresh,
    version,
  }
}
