export function rem(px) {
  return `${px * 2}rpx`
}

export function remPC(px) {
  return `${px}px`
}

export function getDeviceType() {
  const info = uni.getSystemInfoSync()
  return info.windowWidth >= 768 ? 'pc' : 'mobile'
}

export function getDirection() {
  const info = uni.getSystemInfoSync()
  return info.windowWidth > info.windowHeight ? 'landscape' : 'portrait'
}

