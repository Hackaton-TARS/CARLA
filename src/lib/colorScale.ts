const SEQUENTIAL_BLUE_STEPS = [
  "#cde2fb",
  "#b7d3f6",
  "#9ec5f4",
  "#86b6ef",
  "#6da7ec",
  "#5598e7",
  "#3987e5",
  "#2a78d6",
  "#256abf",
  "#1c5cab",
  "#184f95",
  "#104281",
  "#0d366b",
]

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

function rgbToHex([r, g, b]: readonly [number, number, number]) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`
}

/**
 * Sequential blue ramp (references/palette.md) — score 0-100 -> light->dark blue.
 * Interpolates linearly between the two nearest documented steps.
 */
export function sequentialFill(score: number): string {
  const clamped = Math.max(0, Math.min(100, score))
  const t = (clamped / 100) * (SEQUENTIAL_BLUE_STEPS.length - 1)
  const lo = Math.floor(t)
  const hi = Math.min(SEQUENTIAL_BLUE_STEPS.length - 1, lo + 1)
  const frac = t - lo

  const a = hexToRgb(SEQUENTIAL_BLUE_STEPS[lo])
  const b = hexToRgb(SEQUENTIAL_BLUE_STEPS[hi])
  const mixed: [number, number, number] = [
    a[0] + (b[0] - a[0]) * frac,
    a[1] + (b[1] - a[1]) * frac,
    a[2] + (b[2] - a[2]) * frac,
  ]
  return rgbToHex(mixed)
}

export const SEQUENTIAL_BLUE_MIN = SEQUENTIAL_BLUE_STEPS[0]
export const SEQUENTIAL_BLUE_MAX = SEQUENTIAL_BLUE_STEPS[SEQUENTIAL_BLUE_STEPS.length - 1]
