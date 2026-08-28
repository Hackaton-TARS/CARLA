import { getRegionsForMonth } from "@/server/services/regionService"
import { getMacroRegionsForMonth } from "@/server/services/macroRegionService"
import { DATACENTERS } from "@/server/data/datacenters"
import { RegionalMapExplorer } from "@/components/mapa/RegionalMapExplorer"
import type { MacroRegionWithScore, RegionWithScore } from "@/server/types"

export default function MapaRegionalPage() {
  const monthlyRegions: Record<number, RegionWithScore[]> = {}
  const monthlyMacroRegions: Record<number, MacroRegionWithScore[]> = {}
  for (let m = 1; m <= 12; m++) {
    monthlyRegions[m] = getRegionsForMonth(m)
    monthlyMacroRegions[m] = getMacroRegionsForMonth(m)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Mapa Regional
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Adequação por região e datacenters já em operação
        </h1>
        <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">
          Duas visões do mesmo modelo preditivo: a adequação prevista por região (clima,
          disponibilidade hídrica, matriz limpa e curtailment, mês a mês), ou onde já existem
          datacenters em operação hoje — inclusive mais de um na mesma região.
        </p>
      </header>

      <div className="mt-8">
        <RegionalMapExplorer
          monthlyRegions={monthlyRegions}
          monthlyMacroRegions={monthlyMacroRegions}
          datacenters={DATACENTERS}
        />
      </div>
    </div>
  )
}
