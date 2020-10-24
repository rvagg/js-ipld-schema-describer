export default function kind (obj) {
  if (typeof obj === 'number') {
    if (Number.isInteger(obj)) {
      return 'int'
    }
    return 'float'
  }
  if (typeof obj === 'string') {
    return 'string'
  }
  if (obj === null) {
    return 'null'
  }
  if (typeof obj === 'boolean') {
    return 'bool'
  }
  if (typeof obj === 'object' && obj.asCID === obj) {
    return 'link'
  }
  if (obj instanceof Uint8Array) {
    return 'bytes'
  }
  if (Array.isArray(obj)) {
    return 'list'
  }
  if (typeof obj === 'object') {
    return 'map'
  }
  throw new TypeError(`Unknown IPLD kind for value: ${JSON.stringify(obj)}`)
}
