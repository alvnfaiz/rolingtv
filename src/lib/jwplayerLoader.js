const JWPLAYER_KEY = 'ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc='
const JWPLAYER_SCRIPT = '/jwplayer/jwplayer.js'
const JWPLAYER_BASE_URL = '/jwplayer/'

let loadPromise = null

function configureJwPlayer() {
  const jw = window.jwplayer
  if (!jw) return null

  jw.key = JWPLAYER_KEY
  jw.defaults = {
    ...jw.defaults,
    baseUrl: JWPLAYER_BASE_URL,
  }

  return jw
}

export function loadJwPlayer() {
  if (window.jwplayer) {
    return Promise.resolve(configureJwPlayer())
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${JWPLAYER_SCRIPT}"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve(configureJwPlayer()))
        existing.addEventListener('error', reject)
        return
      }

      const script = document.createElement('script')
      script.src = JWPLAYER_SCRIPT
      script.async = true
      script.onload = () => resolve(configureJwPlayer())
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  return loadPromise
}
