import type { ConsumptionPoint, EnergyMix } from "@/server/types"

function seededNoise(hour: number, salt: number) {
  const x = Math.sin(hour * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const BASE_LOAD_KWH = 180
const PEAK_LOAD_KWH = 120

// Brazil's national "horário de ponta" — the whole grid leans on thermal
// backup here regardless of region, which is why the tariff is higher too.
const EVENING_PEAK_CENTER = 19.5
const EVENING_PEAK_WIDTH = 1.6

// National-average-ish mix, used when the company hasn't picked a specific region.
const DEFAULT_MIX: EnergyMix = { hydro: 60, solar: 5, wind: 2, other: 33 }

/**
 * Region-aware grid carbon-intensity curve. Two *independent* effects stack:
 * 1. A daily dip driven by the local matrix's dominant clean source (solar ->
 *    midday dip, wind -> nighttime dip, hydro -> flat baseload, low variance).
 * 2. A national evening-peak bump (~18-21h) when the whole interconnected
 *    grid leans on thermal backup, regardless of region — dampened in
 *    matrices that lean less on thermal to begin with.
 *
 * This is a property of the GRID, not of any single company's own load — the
 * `kwh` curve below (one company's consumption) is a separate, independent
 * quantity that doesn't drive the grid by itself.
 */
export function getDailyConsumption(mix: EnergyMix = DEFAULT_MIX): ConsumptionPoint[] {
  const cleanShare = mix.hydro + mix.solar * 0.9 + mix.wind * 0.95
  const baseCarbon = Math.max(20, 150 - cleanShare * 1.3)
  const amplitude = Math.max(15, 105 - cleanShare * 0.65)
  const eveningPeakAmplitude = Math.max(10, (100 - cleanShare) * 0.6)

  const dominant =
    mix.hydro >= mix.solar && mix.hydro >= mix.wind ? "hydro" : mix.solar >= mix.wind ? "solar" : "wind"
  const reliefCenter = dominant === "wind" ? 3 : 12
  const reliefWidth = dominant === "hydro" ? 10 : dominant === "wind" ? 6 : 4

  return Array.from({ length: 24 }, (_, hour) => {
    const businessCurve = Math.exp(-Math.pow((hour - 14) / 5, 2))
    const kwh =
      BASE_LOAD_KWH + PEAK_LOAD_KWH * businessCurve + (seededNoise(hour, 1) - 0.5) * 12

    let delta = Math.abs(hour - reliefCenter)
    delta = Math.min(delta, 24 - delta) // wrap around midnight for the nighttime wind dip
    const relief = Math.exp(-Math.pow(delta / reliefWidth, 2))

    const eveningBump = Math.exp(-Math.pow((hour - EVENING_PEAK_CENTER) / EVENING_PEAK_WIDTH, 2))

    const gridCarbonIntensity =
      baseCarbon +
      amplitude * (1 - relief) +
      eveningPeakAmplitude * eveningBump +
      (seededNoise(hour, 2) - 0.5) * 10

    return {
      hour,
      kwh: Math.round(kwh * 10) / 10,
      gridCarbonIntensity: Math.round(Math.max(20, gridCarbonIntensity)),
    }
  })
}
