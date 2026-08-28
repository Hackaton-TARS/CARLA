import Link from "next/link"
import type { Recommendation } from "@/server/types"

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}h`
}

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const best = recommendation.windows[0]

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <span aria-hidden style={{ color: "var(--chart-status-good)" }}>
            ●
          </span>
          Recomendação do modelo preditivo
        </h3>
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
          Confiança do modelo: {recommendation.modelConfidence}%
        </span>
      </div>

      <p className="mt-2 text-2xl font-bold">Rode cargas pesadas entre {best.label}</p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/70">
        O modelo identificou essa janela como a mais limpa do dia, impulsionada por{" "}
        <strong>{recommendation.sourceLabel}</strong> — {best.avgCarbonIntensity} gCO₂/kWh, contra{" "}
        {formatHour(recommendation.worstHour)} no pico mais sujo do dia.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {recommendation.windows.map((w) => (
          <div
            key={w.label}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
          >
            <span className="font-medium">{w.label}</span>
            <span className="ml-2 text-black/60 dark:text-white/60">
              {w.avgCarbonIntensity} gCO₂/kWh
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-black/70 dark:text-white/70">
        Deslocando cargas flexíveis para a melhor janela, sua empresa pode evitar até{" "}
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {recommendation.potentialCo2SavingsKg} kg de CO₂
        </span>{" "}
        por dia. Quer economizar ainda mais?{" "}
        <Link href="/datacenters" className="font-medium underline underline-offset-2">
          Veja as regiões com maior potencial eólico e hidrelétrico
        </Link>{" "}
        para novas cargas.
      </p>
    </div>
  )
}
