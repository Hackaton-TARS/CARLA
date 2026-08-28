import type { EnergySource, RegionWithScore } from "@/server/types"

const SOURCE_LABELS: Record<EnergySource, string> = {
  hydro: "Hidrelétrica",
  solar: "Solar",
  wind: "Eólica",
}

export function RegionExplorer({ regions }: { regions: RegionWithScore[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {regions.map((region, index) => (
        <RegionCard key={region.id} region={region} rank={index + 1} />
      ))}
    </div>
  )
}

function RegionCard({ region, rank }: { region: RegionWithScore; rank: number }) {
  const isTop = rank === 1
  return (
    <div
      className={`rounded-2xl border p-5 ${
        isTop
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-black/10 dark:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-black/50 dark:text-white/50">#{rank}</p>
          <h3 className="text-lg font-semibold">
            {region.name} <span className="text-black/50 dark:text-white/50">— {region.state}</span>
          </h3>
        </div>
        <div className="text-right">
          <div className="rounded-full bg-black/5 px-3 py-1 text-sm font-semibold dark:bg-white/10">
            {region.score.total}
          </div>
          <p className="mt-1 text-[10px] text-black/40 dark:text-white/40">
            confiança {region.score.modelConfidence}%
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm text-black/70 dark:text-white/70">{region.highlight}</p>
      <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        Fonte dominante recomendada: {SOURCE_LABELS[region.score.dominantSource]}
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <Metric label="Temp. média" value={`${region.score.avgTempC}°C`} />
        <Metric label="Energia limpa" value={`${region.score.cleanScore}`} />
        <Metric label="Água" value={`${region.score.waterScore}`} />
        <Metric label="Curtailment" value={`${region.score.curtailmentScore}`} />
      </div>

      <div className="mt-3 flex gap-1 text-[11px] text-black/50 dark:text-white/50">
        <span>Hidro {region.mix.hydro}%</span>
        <span>· Solar {region.mix.solar}%</span>
        <span>· Eólica {region.mix.wind}%</span>
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
