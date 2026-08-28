import type { EnergyMix, EnergySource } from "@/server/types"

export function dominantSourceForMix(mix: EnergyMix): EnergySource {
  if (mix.hydro >= mix.solar && mix.hydro >= mix.wind) return "hydro"
  if (mix.solar >= mix.wind) return "solar"
  return "wind"
}
