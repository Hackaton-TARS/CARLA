import { STATE_TO_MACRO } from "@/server/data/stateMacro"
import type { Datacenter, MacroRegionWithScore } from "@/server/types"

export function DatacenterRankingList({
  datacenters,
  macroRegions,
}: {
  datacenters: Datacenter[]
  macroRegions: MacroRegionWithScore[]
}) {
  const macroByCode = Object.fromEntries(macroRegions.map((m) => [m.code, m]))

  const ranked = datacenters
    .map((dc) => ({ dc, macro: macroByCode[STATE_TO_MACRO[dc.state]] }))
    .sort((a, b) => b.macro.score.total - a.macro.score.total)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ranked.map(({ dc, macro }, index) => {
        const usedPct = Math.round((dc.usedCapacityUnits / dc.totalCapacityUnits) * 100)
        const availableUnits = dc.totalCapacityUnits - dc.usedCapacityUnits
        const isTop = index === 0

        return (
          <div
            key={dc.id}
            className={`rounded-2xl border p-5 ${
              isTop ? "border-emerald-500/40 bg-emerald-500/5" : "border-black/10 dark:border-white/10"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-black/50 dark:text-white/50">#{index + 1}</p>
                <h3 className="text-lg font-semibold">{dc.name}</h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {dc.operator} · {dc.city}/{dc.state}
                </p>
              </div>
              <div className="rounded-full bg-black/5 px-3 py-1 text-sm font-semibold dark:bg-white/10">
                {macro.score.total}
              </div>
            </div>

            <p className="mt-2 text-xs text-black/50 dark:text-white/50">
              Score da região {macro.name} este mês — matriz limpa, curtailment, clima e água.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <Metric label="Capacidade" value={`${dc.totalCapacityUnits}`} />
              <Metric label="Em uso" value={`${usedPct}%`} />
              <Metric label="Livre" value={`${availableUnits}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/5 px-2 py-2 dark:bg-white/10">
      <p className="text-black/50 dark:text-white/50">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
