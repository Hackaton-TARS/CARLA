"use client"

import { useState } from "react"
import type { Co2Estimate } from "@/server/types"

export function Co2Calculator({ intensityDeltaGPerKwh }: { intensityDeltaGPerKwh: number }) {
  const [kwh, setKwh] = useState("500")
  const [result, setResult] = useState<Co2Estimate | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCalculate() {
    setLoading(true)
    try {
      const res = await fetch("/api/co2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kwhShifted: Number(kwh), intensityDeltaGPerKwh }),
      })
      if (res.ok) setResult(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        Calculadora de crédito de carbono
      </h3>
      <p className="mt-1 text-sm text-black/70 dark:text-white/70">
        Estime o CO₂ evitado ao deslocar consumo do horário mais sujo para o mais limpo do dia —
        uma diferença real de <strong>{intensityDeltaGPerKwh} gCO₂/kWh</strong> na sua região
        selecionada, não uma média genérica da rede.
      </p>

      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-black/60 dark:text-white/60" htmlFor="kwh">
            kWh deslocados por mês
          </label>
          <input
            id="kwh"
            type="number"
            min={0}
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Calculando..." : "Calcular"}
        </button>
      </div>

      {result && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="CO₂ evitado" value={`${result.co2AvoidedKg} kg`} />
          <Stat label="Créditos de carbono (est.)" value={`${result.carbonCreditsEstimate} t`} />
          <Stat label="Valor estimado" value={`R$ ${result.valueEstimateBRL.toLocaleString("pt-BR")}`} />
        </div>
      )}

      <p className="mt-4 text-xs text-black/50 dark:text-white/50">
        Metodologia: CO₂ evitado = kWh deslocados × diferença de intensidade de carbono
        (sujo − limpo) entre os horários. Preço de crédito é uma referência ilustrativa do
        mercado voluntário — o mercado regulado brasileiro (SBCE) ainda não tem preço de
        referência público. Para produção, plugar dados reais de ONS/ElectricityMaps.
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/5 px-3 py-3 dark:bg-white/10">
      <p className="text-xs text-black/60 dark:text-white/60">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}
