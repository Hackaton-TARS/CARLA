"use client"

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function MonthSlider({
  month,
  onChange,
}: {
  month: number
  onChange: (month: number) => void
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <div className="flex items-center justify-between">
        <label htmlFor="month" className="text-sm font-medium">
          Época do ano: <span className="font-semibold">{MONTH_NAMES[month - 1]}</span>
        </label>
        <span className="text-xs text-black/50 dark:text-white/50">
          Arraste para ver como as condições mudam ao longo do ano
        </span>
      </div>
      <input
        id="month"
        type="range"
        min={1}
        max={12}
        value={month}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--chart-series-1)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-black/40 dark:text-white/40">
        {MONTH_NAMES.map((m) => (
          <span key={m}>{m.slice(0, 3)}</span>
        ))}
      </div>
    </div>
  )
}
