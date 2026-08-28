"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ConsumptionPoint } from "@/server/types"

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}h`
}

export function EnergyChart({ points }: { points: ConsumptionPoint[] }) {
  const consumption = points.map((p) => ({ hora: formatHour(p.hour), valor: p.kwh }))
  const carbon = points.map((p) => ({ hora: formatHour(p.hour), valor: p.gridCarbonIntensity }))

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <MiniAreaChart
          title="Consumo da sua operação"
          unit="kWh"
          data={consumption}
          color="var(--chart-series-1)"
        />
        <MiniAreaChart
          title="Intensidade de carbono da rede"
          unit="gCO₂/kWh"
          data={carbon}
          color="var(--chart-series-2)"
        />
      </div>
      <p className="mt-3 text-xs text-black/50 dark:text-white/50">
        São duas grandezas independentes: o consumo é só da sua operação; a intensidade de carbono
        é da rede elétrica inteira (qual usina está sendo despachada naquela hora — mais limpa com
        sol/vento fortes, mais suja no horário de ponta, ~18h-21h, quando o sistema todo aciona
        térmicas). Uma empresa isolada não move a rede — por isso as duas curvas nem sempre andam
        juntas.
      </p>
    </div>
  )
}

function MiniAreaChart({
  title,
  unit,
  data,
  color,
}: {
  title: string
  unit: string
  data: { hora: string; valor: number }[]
  color: string
}) {
  return (
    <div>
      <p className="text-sm font-medium text-black/70 dark:text-white/70">
        {title} <span className="text-black/40 dark:text-white/40">({unit})</span>
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="1 0"
            stroke="var(--chart-gridline)"
            vertical={false}
          />
          <XAxis
            dataKey="hora"
            fontSize={11}
            interval={3}
            stroke="var(--chart-gridline)"
            tick={{ fill: "var(--chart-text-secondary)" }}
          />
          <YAxis
            fontSize={11}
            stroke="var(--chart-gridline)"
            tick={{ fill: "var(--chart-text-secondary)" }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "var(--chart-surface)",
              border: "1px solid var(--chart-gridline)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--chart-text-secondary)" }}
            formatter={(value) => [`${value} ${unit}`, undefined]}
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
