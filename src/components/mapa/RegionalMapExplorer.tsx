"use client"

import { useState } from "react"
import { DatacentersView } from "@/components/mapa/DatacentersView"
import { MapaExplorer } from "@/components/mapa/MapaExplorer"
import type { Datacenter, MacroRegionWithScore, RegionWithScore } from "@/server/types"

type Tab = "adequacao" | "datacenters"

export function RegionalMapExplorer({
  monthlyRegions,
  monthlyMacroRegions,
  datacenters,
  showRanking = true,
}: {
  monthlyRegions: Record<number, RegionWithScore[]>
  monthlyMacroRegions: Record<number, MacroRegionWithScore[]>
  datacenters: Datacenter[]
  showRanking?: boolean
}) {
  const [tab, setTab] = useState<Tab>("adequacao")

  return (
    <div>
      <div className="flex gap-2 border-b border-black/10 dark:border-white/10">
        <TabButton active={tab === "adequacao"} onClick={() => setTab("adequacao")}>
          Adequação por região
        </TabButton>
        <TabButton active={tab === "datacenters"} onClick={() => setTab("datacenters")}>
          Datacenters no Brasil
        </TabButton>
      </div>

      <div className="mt-6">
        {tab === "adequacao" ? (
          <MapaExplorer
            monthlyRegions={monthlyRegions}
            monthlyMacroRegions={monthlyMacroRegions}
            showRanking={showRanking}
          />
        ) : (
          <DatacentersView
            datacenters={datacenters}
            monthlyMacroRegions={monthlyMacroRegions}
            showRanking={showRanking}
          />
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
        active
          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
          : "border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}
