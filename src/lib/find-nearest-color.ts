type ColorList = Record<string, string>
type ColorType = 'hex' | 'rgb' | 'hsl'

function colorDistance(
  color1: [number, number, number],
  color2: [number, number, number]
): number {
  let [r1, g1, b1] = color1
  let [r2, g2, b2] = color2

  let dr = r1 - r2
  let dg = g1 - g2
  let db = b1 - b2

  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function hexToRgb(hex: string): [number, number, number] {
  if (hex.length === 4) {
    // Convert 3-digit hex to 6-digit form
    let expandedHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    hex = expandedHex
  }

  let bigint = parseInt(hex.slice(1), 16)
  let r = (bigint >> 16) & 255
  let g = (bigint >> 8) & 255
  let b = bigint & 255

  return [r, g, b]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  let m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return [r, g, b]
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)
}

function isValidRgb(rgb: string): boolean {
  let values = rgb.match(/\d+/g)?.map(Number)
  if (!values || values.length < 3) return false

  let [r, g, b] = values
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
}

function isValidHsl(hsl: string): boolean {
  let values = hsl.match(/\d+/g)?.map(Number)
  if (!values || values.length < 3) return false

  let [h, s, l] = values
  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100
}

export function findNearestColor(
  colors: ColorList,
  color: string,
  type: ColorType
): string {
  if (type === 'hex' && !isValidHex(color)) return ''
  if (type === 'rgb' && !isValidRgb(color)) return ''
  if (type === 'hsl' && !isValidHsl(color)) return ''

  let minDistance = Infinity
  let nearestColor = ''
  let targetRgb: [number, number, number]

  if (type === 'hex') {
    targetRgb = hexToRgb(color)
  } else if (type === 'rgb') {
    let rgb = color.match(/\d+/g)?.map(Number)
    if (!rgb || rgb.length < 3) return ''
    targetRgb = rgb as [number, number, number]
  } else if (type === 'hsl') {
    let hsl = color.match(/\d+/g)?.map(Number)
    if (!hsl || hsl.length < 3) return ''
    targetRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
  } else {
    return ''
  }

  for (let colorName in colors) {
    let currentRgb = hexToRgb(colors[colorName])
    let distance = colorDistance(targetRgb, currentRgb)
    if (distance < minDistance) {
      minDistance = distance
      nearestColor = colorName
    }
  }

  return nearestColor
}
