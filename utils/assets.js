export function jiliAsset(path = '') {
  const cleanPath = String(path)
    .replace(/^@\//, '')
    .replace(/^assets\//, '')
    .replace(/^\/+/, '')

  return `/static/game/${cleanPath}`
}
