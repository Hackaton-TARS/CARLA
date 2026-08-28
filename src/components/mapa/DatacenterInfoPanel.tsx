import type { Datacenter } from "@/server/types"

export function DatacenterInfoPanel({ datacenter }: { datacenter: Datacenter | null }) {
  if (!datacenter) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 p-6 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        <p>Clique em um datacenter no mapa para ver os detalhes.</p>
      </div>
    )
  }

  const availableUnits = datacenter.totalCapacityUnits - datacenter.usedCapacityUnits
  const usedPct = Math.round((datacenter.usedCapacityUnits / datacenter.totalCapacityUnits) * 100)

  return (
    <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
      <p className="text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
        {datacenter.city} · {datacenter.state}
      </p>
      <h3 className="mt-1 text-xl font-semibold">{datacenter.name}</h3>
      <p className="text-sm text-black/60 dark:text-white/60">Operado por {datacenter.operator}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Metric label="Capacidade total" value={`${datacenter.totalCapacityUnits}`} />
        <Metric label="Em uso" value={`${usedPct}%`} />
        <Metric label="Livre" value={`${availableUnits}`} />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${usedPct}%`, background: "var(--chart-series-2)" }}
        />
      </div>
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
