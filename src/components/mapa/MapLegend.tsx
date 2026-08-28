import { SEQUENTIAL_BLUE_MAX, SEQUENTIAL_BLUE_MIN } from "@/lib/colorScale"

export function MapLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-black/60 dark:text-white/60">
      <span>Menos favorável</span>
      <div
        className="h-2 w-40 rounded-full"
        style={{
          background: `linear-gradient(to right, ${SEQUENTIAL_BLUE_MIN}, ${SEQUENTIAL_BLUE_MAX})`,
        }}
      />
      <span>Mais favorável</span>
    </div>
  )
}
