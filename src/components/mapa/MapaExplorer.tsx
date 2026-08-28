"use client"

import { useMemo, useState } from "react"
import { BrazilMap } from "@/components/mapa/BrazilMapClient"
import type { SelectedState } from "@/components/mapa/BrazilMap"
import { MapLegend } from "@/components/mapa/MapLegend"
import { MonthSlider } from "@/components/mapa/MonthSlider"
import { RegionDetailPanel } from "@/components/mapa/RegionDetailPanel"
import { RegionExplorer } from "@/components/mapa/RegionExplorer"
import type { Datacenter, MacroRegionCode, MacroRegionWithScore, RegionWithScore } from "@/server/types"

export function MapaExplorer({
  monthlyRegions,
  monthlyMacroRegions,
  datacenters,
  showRanking = true,
}: {
  monthlyRegions: Record<number, RegionWithScore[]>
  monthlyMacroRegions: Record<number, MacroRegionWithScore[]>
  datacenters?: Datacenter[]
  showRanking?: boolean
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [selected, setSelected] = useState<SelectedState | null>(null)

  const regions = monthlyRegions[month]
  const scoresByMacro = useMemo(() => {
    const record = {} as Record<MacroRegionCode, MacroRegionWithScore>
    for (const macro of monthlyMacroRegions[month]) {
      record[macro.code] = macro
    }
    return record
  }, [monthlyMacroRegions, month])

  const selectedMacro = selected ? scoresByMacro[selected.macroCode] ?? null : null
  const selectedCity = selected ? regions.find((r) => r.state === selected.sigla) ?? null : null

  return (
    <div>
      <MonthSlider month={month} onChange={setMonth} />

      <div className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
            Adequação por região
          </h2>
          <MapLegend />
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="mx-auto w-full max-w-md">
            <BrazilMap
              scoresByMacro={scoresByMacro}
              cities={regions}
              datacenters={datacenters}
              selectedSigla={selected?.sigla ?? null}
              onSelectState={setSelected}
            />
          </div>
          <RegionDetailPanel selected={selected} macro={selectedMacro} city={selectedCity} />
        </div>
      </div>

      {showRanking && (
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
            Ranking de cidades candidatas
          </h2>
          <RegionExplorer regions={regions} />
        </div>
      )}
    </div>
  )
}
