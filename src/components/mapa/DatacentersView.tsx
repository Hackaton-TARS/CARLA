"use client"

import { useState } from "react"
import { BrazilMap } from "@/components/mapa/BrazilMapClient"
import { DatacenterInfoPanel } from "@/components/mapa/DatacenterInfoPanel"
import { DatacenterRankingList } from "@/components/mapa/DatacenterRankingList"
import { MonthSlider } from "@/components/mapa/MonthSlider"
import type { Datacenter, MacroRegionWithScore } from "@/server/types"

export function DatacentersView({
  datacenters,
  monthlyMacroRegions,
  showRanking = true,
}: {
  datacenters: Datacenter[]
  monthlyMacroRegions: Record<number, MacroRegionWithScore[]>
  showRanking?: boolean
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [selectedDc, setSelectedDc] = useState<Datacenter | null>(null)

  return (
    <div>
      <MonthSlider month={month} onChange={setMonth} />

      <div className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="mx-auto w-full max-w-md">
            <BrazilMap
              cities={[]}
              datacenters={datacenters}
              selectedDatacenterId={selectedDc?.id ?? null}
              onSelectDatacenter={setSelectedDc}
              selectedSigla={null}
              onSelectState={() => {}}
              flatFill
            />
          </div>
          <DatacenterInfoPanel datacenter={selectedDc} />
        </div>
      </div>

      {showRanking && (
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
            Ranking de melhores datacenters
          </h2>
          <DatacenterRankingList datacenters={datacenters} macroRegions={monthlyMacroRegions[month]} />
        </div>
      )}
    </div>
  )
}
