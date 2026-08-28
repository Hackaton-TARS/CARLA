import { REGIONS } from "@/server/data/regions"
import { dominantSourceForMix } from "@/server/services/energySource"
import type { EnergyProfile, MonthlyScore, RegionWithScore } from "@/server/types"

function seasonalTemp(profile: EnergyProfile, month: number) {
  const phase = ((month - 1) / 12) * Math.PI * 2
  const seasonalOffset = Math.cos(phase - Math.PI / 6)
  return profile.baseTempC + seasonalOffset * profile.tempAmplitudeC
}

function cleanScoreFor(profile: EnergyProfile) {
  return profile.mix.hydro * 1 + profile.mix.solar * 0.9 + profile.mix.wind * 0.95
}

function coolingScoreFor(tempC: number) {
  const ideal = 18
  const diff = Math.max(0, tempC - ideal)
  return Math.max(0, 100 - diff * 4)
}

/**
 * Illustrative confidence signal: the model is more confident when one clean
 * source clearly leads the local matrix, and less confident when the mix is
 * more evenly split between hydro/solar/wind.
 */
function modelConfidenceFor(profile: EnergyProfile) {
  const shares = [profile.mix.hydro, profile.mix.solar, profile.mix.wind].sort((a, b) => b - a)
  const lead = shares[0] - shares[1]
  return Math.round(Math.min(97, Math.max(72, 74 + lead * 0.35)))
}

export function scoreProfileForMonth(profile: EnergyProfile, month: number): MonthlyScore {
  const avgTempC = seasonalTemp(profile, month)
  const cleanScore = Math.min(100, cleanScoreFor(profile))
  const coolingScore = coolingScoreFor(avgTempC)
  const waterScore = profile.waterAvailability
  const curtailmentScore = Math.min(100, profile.curtailmentIndex)
  // Curtailment carries real weight: a region already wasting clean generation
  // has "free" capacity for new flexible load, independent of climate.
  const total =
    cleanScore * 0.35 + curtailmentScore * 0.25 + coolingScore * 0.25 + waterScore * 0.15

  return {
    month,
    cleanScore: Math.round(cleanScore),
    coolingScore: Math.round(coolingScore),
    waterScore: Math.round(waterScore),
    curtailmentScore: Math.round(curtailmentScore),
    total: Math.round(total * 10) / 10,
    avgTempC: Math.round(avgTempC * 10) / 10,
    modelConfidence: modelConfidenceFor(profile),
    dominantSource: dominantSourceForMix(profile.mix),
  }
}

export function getRegionsForMonth(month: number): RegionWithScore[] {
  return REGIONS.map((region) => ({
    ...region,
    score: scoreProfileForMonth(region, month),
  })).sort((a, b) => b.score.total - a.score.total)
}

export function getRegionYearCurve(regionId: string) {
  const region = REGIONS.find((r) => r.id === regionId)
  if (!region) return null
  return Array.from({ length: 12 }, (_, i) => scoreProfileForMonth(region, i + 1))
}

export function getRegionById(regionId: string) {
  return REGIONS.find((r) => r.id === regionId) ?? null
}
