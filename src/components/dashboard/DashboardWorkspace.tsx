"use client"

import { useMemo, useState } from "react"
import { getDailyConsumption } from "@/server/data/consumption"
import { buildRecommendation } from "@/server/services/recommendationService"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { RecommendationCard } from "@/components/dashboard/RecommendationCard"
import { ExpansionInsightCard } from "@/components/dashboard/ExpansionInsightCard"
import { Co2Calculator } from "@/components/dashboard/Co2Calculator"
import type { RegionWithScore } from "@/server/types"

export function DashboardWorkspace({ regions }: { regions: RegionWithScore[] }) {
  const states = useMemo(
    () => Array.from(new Set(regions.map((r) => r.state))).sort(),
    [regions],
  )

  const defaultRegion = regions.find((r) => r.id === "sao-paulo-sp") ?? regions[0]
  const [state, setState] = useState(defaultRegion.state)
  const [regionId, setRegionId] = useState(defaultRegion.id)

  const citiesInState = useMemo(() => regions.filter((r) => r.state === state), [regions, state])
  const selected = citiesInState.find((r) => r.id === regionId) ?? citiesInState[0] ?? regions[0]
  const topRegion = regions[0]

  function handleStateChange(nextState: string) {
    setState(nextState)
    const firstCity = regions.find((r) => r.state === nextState)
    if (firstCity) setRegionId(firstCity.id)
  }

  const points = useMemo(() => getDailyConsumption(selected.mix), [selected])
  const recommendation = useMemo(() => buildRecommendation(selected.mix), [selected])

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:grid-cols-2">
        <div>
          <label htmlFor="state" className="text-xs font-medium text-black/60 dark:text-white/60">
            Estado
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          >
            {states.map((uf) => (
              <option key={uf} value={uf} className="text-black">
                {uf}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="text-xs font-medium text-black/60 dark:text-white/60">
            Cidade
          </label>
          <select
            id="city"
            value={selected.id}
            onChange={(e) => setRegionId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          >
            {citiesInState.map((r) => (
              <option key={r.id} value={r.id} className="text-black">
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-black/50 dark:text-white/50 sm:col-span-2">
          O consumo e a intensidade de carbono variam bastante por cidade/estado — a matriz
          energética local e o clima mudam a curva inteira.
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <EnergyChart points={points} />
      </section>

      <section className="mt-6">
        <RecommendationCard recommendation={recommendation} />
      </section>

      {selected.id !== topRegion.id && (
        <section className="mt-6">
          <ExpansionInsightCard current={selected} best={topRegion} />
        </section>
      )}

      <section className="mt-6">
        <Co2Calculator
          intensityDeltaGPerKwh={recommendation.worstIntensity - recommendation.bestIntensity}
        />
      </section>
    </div>
  )
}
