import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import viVN from './locales/vi-VN'

const defaultLocal = 'en-US'

const messages = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'vi-VN': viVN
}

const overLocal = {
  'en-US': 'en',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
  'vi-VN': 'vi'
}

const resultLocal = {
  en: 'en-US',
  cn: 'zh-CN',
  tw: 'zh-TW',
  vi: 'vi-VN',
  'vi-VN': 'vi-VN'
}

function getStoredLang() {
  const savedLang = uni.getStorageSync('lang')
  if (savedLang && savedLang !== 'undefined') {
    return resultLocal[savedLang] || savedLang
  }
  return ''
}

export function getLanguage() {
  const savedLang = getStoredLang()
  if (savedLang && messages[savedLang]) {
    return savedLang
  }

  let locale = defaultLocal
  try {
    const systemInfo = uni.getSystemInfoSync()
    const language = systemInfo.language || defaultLocal
    const shortLang = language.split('-')[0].toLowerCase()

    if (shortLang === 'zh') {
      locale = language.includes('TW') || language.includes('HK') ? 'zh-TW' : 'zh-CN'
    } else if (resultLocal[shortLang]) {
      locale = resultLocal[shortLang]
    }
  } catch (e) {
    locale = defaultLocal
  }

  uni.setStorageSync('lang', overLocal[locale] || overLocal[defaultLocal])
  return locale
}

export function getLanguageValue() {
  return getLanguage()
}

function readPath(source, path) {
  return path.split('.').reduce((target, key) => {
    if (target && Object.prototype.hasOwnProperty.call(target, key)) {
      return target[key]
    }
    return undefined
  }, source)
}

export const i18n = {
  locale: getLanguage(),
  messages,
  t(key) {
    const value = readPath(messages[this.locale] || {}, key)
    return value === undefined ? key : value
  }
}

export const setLanguage = lang => {
  const locale = messages[lang] ? lang : defaultLocal
  i18n.locale = locale
  uni.setStorageSync('lang', overLocal[locale])
}

export default {
  install(Vue) {
    Vue.prototype.$t = key => i18n.t(key)
    Vue.prototype.$i18n = i18n
  },
  ...i18n
}

