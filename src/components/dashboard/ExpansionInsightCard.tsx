import Link from "next/link"
import type { RegionWithScore } from "@/server/types"

export function ExpansionInsightCard({
  current,
  best,
}: {
  current: RegionWithScore
  best: RegionWithScore
}) {
  const gap = Math.round((best.score.total - current.score.total) * 10) / 10

  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.02]">
      <p className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        Oportunidade de expansão
      </p>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        Sua operação está em <strong>{current.name}</strong> (score {current.score.total}, confiança{" "}
        {current.score.modelConfidence}%). O modelo preditivo aponta{" "}
        <strong>{best.name}</strong> como a região mais favorável este mês — score {best.score.total},
        um ganho potencial de <strong>{gap} pontos</strong> em matriz limpa, resfriamento e
        disponibilidade hídrica.
      </p>
      <Link
        href="/datacenters"
        className="mt-3 inline-block text-sm font-medium text-emerald-600 underline underline-offset-2 dark:text-emerald-400"
      >
        Avaliar expansão ou migração de carga para {best.name} →
      </Link>
    </div>
  )
}
