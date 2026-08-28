import { MACRO_REGIONS } from "@/server/data/macroRegions"
import { scoreProfileForMonth } from "@/server/services/regionService"
import type { MacroRegionWithScore } from "@/server/types"

export function getMacroRegionsForMonth(month: number): MacroRegionWithScore[] {
  return MACRO_REGIONS.map((macro) => ({
    ...macro,
    score: scoreProfileForMonth(macro, month),
  }))
}
