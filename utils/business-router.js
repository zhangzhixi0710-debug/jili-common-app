const GAME_PAGE = '/pages/game/ingame/index'

function encodeQuery(params = {}) {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}

export function buildGamePageUrl(params = {}) {
  const query = encodeQuery(params)
  return query ? `${GAME_PAGE}?${query}` : GAME_PAGE
}

export function isGameRouteUrl(url = '') {
  return url.indexOf(GAME_PAGE) !== -1 || /\/[^/?#]+\/ingame\/?([?#].*)?$/.test(url)
}

export function normalizeGameLocation(location = {}) {
  if (typeof location === 'string') {
    if (location.indexOf(GAME_PAGE) !== -1) return location

    const legacyMatch = location.match(/^\/?([^/?#]+)\/ingame\/?(?:\?(.+))?$/)
    if (legacyMatch) {
      const params = { prefix: legacyMatch[1] }
      if (legacyMatch[2]) {
        legacyMatch[2].split('&').forEach(item => {
          const pair = item.split('=')
          if (pair[0]) params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
        })
      }
      return buildGamePageUrl(params)
    }

    return location
  }

  if (location.path && /\/[^/?#]+\/ingame\/?$/.test(location.path)) {
    const prefix = location.params && location.params.prefix
      ? location.params.prefix
      : location.path.split('/').filter(Boolean)[0]
    return buildGamePageUrl({ prefix, ...(location.query || {}) })
  }

  if (location.url) return normalizeGameLocation(location.url)
  return location
}

export function normalizeCurrentH5GameRoute() {
  // #ifdef H5
  if (typeof window === 'undefined') return ''
  const href = window.location.href
  const hash = window.location.hash || ''
  if (href.indexOf(GAME_PAGE) !== -1 || hash.indexOf(GAME_PAGE) !== -1) return ''

  const url = new URL(href)
  const match = url.pathname.match(/^\/([^/?#]+)\/ingame\/?$/)
  if (!match) return ''

  const params = { prefix: match[1] }
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return buildGamePageUrl(params)
  // #endif
  return ''
}

export function installRouterCompat(Vue) {
  const router = {
    push(location) {
      return uni.navigateTo({ url: normalizeGameLocation(location) })
    },
    replace(location) {
      return uni.redirectTo({ url: normalizeGameLocation(location) })
    },
    back(delta = 1) {
      return uni.navigateBack({ delta: typeof delta === 'number' ? delta : 1 })
    },
    go(delta = 1) {
      return uni.navigateBack({ delta: Math.abs(delta) || 1 })
    },
  }

  const defineCompatProperty = (name, descriptor) => {
    if (name in Vue.prototype) return

    const existing = Object.getOwnPropertyDescriptor(Vue.prototype, name)
    if (existing && !existing.configurable) return

    try {
      Object.defineProperty(Vue.prototype, name, descriptor)
    } catch (error) {
      // UniApp may define non-configurable router fields during H5 bootstrap.
    }
  }

  defineCompatProperty('$router', {
    configurable: true,
    get() {
      return router
    },
  })

  defineCompatProperty('$route', {
    configurable: true,
    get() {
      const pages = getCurrentPages()
      const current = pages && pages.length ? pages[pages.length - 1] : null
      const query = current && current.options ? current.options : {}
      const path = current && current.route ? `/${current.route}` : ''

      return {
        path,
        fullPath: buildGamePageUrl(query),
        query,
        params: query,
      }
    },
  })
  Vue.prototype.$jiliRouter = {
    GAME_PAGE,
    buildGamePageUrl,
    isGameRouteUrl,
    normalizeGameLocation,
  }
}

export { GAME_PAGE }
