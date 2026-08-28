import type { EnergySource, MacroRegionWithScore, RegionWithScore } from "@/server/types"
import type { SelectedState } from "@/components/mapa/BrazilMap"

const SOURCE_LABELS: Record<EnergySource, string> = {
  hydro: "Hidrelétrica",
  solar: "Solar",
  wind: "Eólica",
}

export function RegionDetailPanel({
  selected,
  macro,
  city,
}: {
  selected: SelectedState | null
  macro: MacroRegionWithScore | null
  city: RegionWithScore | null
}) {
  if (!selected || !macro) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 p-6 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        <p>Clique em um estado ou marcador no mapa para ver os detalhes do modelo preditivo.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      {city && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={city.image} alt={city.name} className="h-40 w-full object-cover" />
      )}

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
          {selected.sigla} · Região {macro.name}
        </p>
        <h3 className="mt-1 text-xl font-semibold">{city ? city.name : selected.name}</h3>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <Metric label="Score" value={`${macro.score.total}`} />
          <Metric label="Confiança" value={`${macro.score.modelConfidence}%`} />
          <Metric label="Temp. média" value={`${macro.score.avgTempC}°C`} />
          <Metric label="Água" value={`${macro.score.waterScore}`} />
          <Metric label="Curtailment" value={`${macro.score.curtailmentScore}`} />
          <Metric label="Energia limpa" value={`${macro.score.cleanScore}`} />
        </div>

        <p className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Fonte dominante recomendada: {SOURCE_LABELS[macro.score.dominantSource]}
        </p>

        <div className="mt-2 flex gap-3 text-[11px] text-black/50 dark:text-white/50">
          <span>Hidro {macro.mix.hydro}%</span>
          <span>Solar {macro.mix.solar}%</span>
          <span>Eólica {macro.mix.wind}%</span>
        </div>

        {city ? (
          <p className="mt-4 text-sm text-black/70 dark:text-white/70">{city.highlight}</p>
        ) : (
          <p className="mt-4 text-sm text-black/70 dark:text-white/70">
            Nenhuma cidade candidata catalogada especificamente neste estado ainda — o score acima
            reflete a média da região {macro.name}.
          </p>
        )}
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
