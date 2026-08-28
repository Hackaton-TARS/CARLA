import { getDailyConsumption } from "@/server/data/consumption"
import { dominantSourceForMix } from "@/server/services/energySource"
import type { EnergyMix, EnergySource, Recommendation, RecommendationWindow } from "@/server/types"

const FLEXIBLE_LOAD_SHARE = 0.35
const WINDOW_SIZE = 4

const DEFAULT_MIX: EnergyMix = { hydro: 60, solar: 5, wind: 2, other: 33 }

const SOURCE_LABELS: Record<EnergySource, string> = {
  solar: "pico de geração solar",
  wind: "reforço de geração eólica",
  hydro: "base hidrelétrica estável",
}

export function buildRecommendation(mix: EnergyMix = DEFAULT_MIX): Recommendation {
  const points = getDailyConsumption(mix)

  let bestHour = points[0].hour
  let worstHour = points[0].hour
  for (const p of points) {
    if (p.gridCarbonIntensity < points.find((x) => x.hour === bestHour)!.gridCarbonIntensity) {
      bestHour = p.hour
    }
    if (p.gridCarbonIntensity > points.find((x) => x.hour === worstHour)!.gridCarbonIntensity) {
      worstHour = p.hour
    }
  }

  const windows: RecommendationWindow[] = []
  for (let start = 0; start <= 24 - WINDOW_SIZE; start++) {
    const slice = points.slice(start, start + WINDOW_SIZE)
    const avg = slice.reduce((sum, p) => sum + p.gridCarbonIntensity, 0) / slice.length
    windows.push({
      startHour: start,
      endHour: start + WINDOW_SIZE,
      avgCarbonIntensity: Math.round(avg),
      label: `${String(start).padStart(2, "0")}h–${String(start + WINDOW_SIZE).padStart(2, "0")}h`,
    })
  }
  windows.sort((a, b) => a.avgCarbonIntensity - b.avgCarbonIntensity)
  const topWindows = windows.slice(0, 3)

  const worstPoint = points.find((p) => p.hour === worstHour)!
  const bestPoint = points.find((p) => p.hour === bestHour)!
  const flexibleKwhPerHour = points.reduce((s, p) => s + p.kwh, 0) / points.length * FLEXIBLE_LOAD_SHARE
  const intensityDeltaKg = (worstPoint.gridCarbonIntensity - bestPoint.gridCarbonIntensity) / 1000
  const potentialCo2SavingsKg = flexibleKwhPerHour * intensityDeltaKg * WINDOW_SIZE

  const dominantSource = dominantSourceForMix(mix)
  const spread = worstPoint.gridCarbonIntensity - bestPoint.gridCarbonIntensity
  const modelConfidence = Math.round(Math.min(96, Math.max(70, 70 + spread / 2)))

  return {
    windows: topWindows,
    bestHour,
    worstHour,
    bestIntensity: bestPoint.gridCarbonIntensity,
    worstIntensity: worstPoint.gridCarbonIntensity,
    potentialCo2SavingsKg: Math.round(potentialCo2SavingsKg * 100) / 100,
    dominantSource,
    sourceLabel: SOURCE_LABELS[dominantSource],
    modelConfidence,
  }
}
