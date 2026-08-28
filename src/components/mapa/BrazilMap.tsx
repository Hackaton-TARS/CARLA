"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { select } from "d3-selection"
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import brazilStates from "@/data/br_states_simplified.json"
import { sequentialFill } from "@/lib/colorScale"
import type { Datacenter, MacroRegionCode, MacroRegionWithScore, RegionWithScore } from "@/server/types"

type StateProperties = {
  SIGLA: string
  Estado: string
  FK_macro: MacroRegionCode
}

export type SelectedState = {
  sigla: string
  name: string
  macroCode: MacroRegionCode
}

const geoData = brazilStates as unknown as FeatureCollection<Geometry, StateProperties>

const WIDTH = 720
const HEIGHT = 720

export function BrazilMap({
  scoresByMacro = {} as Record<MacroRegionCode, MacroRegionWithScore>,
  cities,
  datacenters,
  selectedDatacenterId,
  onSelectDatacenter,
  selectedSigla,
  onSelectState,
  flatFill = false,
}: {
  scoresByMacro?: Record<MacroRegionCode, MacroRegionWithScore>
  cities: RegionWithScore[]
  datacenters?: Datacenter[]
  selectedDatacenterId?: string | null
  onSelectDatacenter?: (dc: Datacenter) => void
  selectedSigla: string | null
  onSelectState: (state: SelectedState | null) => void
  /** Neutral state fill with no score detail — for views that shouldn't reveal the site-selection scoring. */
  flatFill?: boolean
}) {
  const [hovered, setHovered] = useState<{
    label: string
    detail?: string
    x: number
    y: number
  } | null>(null)
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity)

  const svgRef = useRef<SVGSVGElement>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const { pathFor, projectCity, siglaToMacro } = useMemo(() => {
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], geoData)
    const path = geoPath(projection)
    const macroBySigla: Record<string, MacroRegionCode> = {}
    for (const feature of geoData.features) {
      macroBySigla[feature.properties.SIGLA] = feature.properties.FK_macro
    }
    return {
      pathFor: (feature: Feature<Geometry, StateProperties>) => path(feature) ?? "",
      projectCity: (lat: number, lng: number) => projection([lng, lat]),
      siglaToMacro: macroBySigla,
    }
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => setTransform(event.transform))
    zoomBehaviorRef.current = zoomBehavior
    select(svgRef.current).call(zoomBehavior)
  }, [])

  function zoomBy(factor: number) {
    if (!svgRef.current || !zoomBehaviorRef.current) return
    select(svgRef.current).call(zoomBehaviorRef.current.scaleBy, factor)
  }

  function resetZoom() {
    if (!svgRef.current || !zoomBehaviorRef.current) return
    select(svgRef.current).call(zoomBehaviorRef.current.transform, zoomIdentity)
  }

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
        <button
          onClick={() => zoomBy(1.4)}
          aria-label="Aproximar"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-sm font-semibold shadow-sm hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white/10"
        >
          +
        </button>
        <button
          onClick={() => zoomBy(1 / 1.4)}
          aria-label="Afastar"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-sm font-semibold shadow-sm hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white/10"
        >
          −
        </button>
        <button
          onClick={resetZoom}
          aria-label="Redefinir zoom"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[10px] font-semibold shadow-sm hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-white/10"
        >
          ⟲
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={
          flatFill
            ? "Mapa do Brasil com datacenters existentes marcados por estado"
            : "Mapa do Brasil colorido por adequação a datacenters, por região — clique em um estado para detalhes, arraste ou use a roda do mouse para navegar"
        }
      >
        <g transform={transform.toString()}>
          {geoData.features.map((feature) => {
            const macro = scoresByMacro[feature.properties.FK_macro]
            const fill = flatFill ? "var(--map-flat-fill)" : sequentialFill(macro?.score.total ?? 0)
            const isSelected = selectedSigla === feature.properties.SIGLA

            return (
              <path
                key={feature.properties.SIGLA}
                d={pathFor(feature)}
                fill={fill}
                stroke={isSelected ? "var(--map-marker)" : "var(--map-stroke)"}
                strokeWidth={isSelected ? 2.5 / transform.k : 1 / transform.k}
                className={flatFill ? "" : "cursor-pointer transition-[stroke-width]"}
                onPointerMove={(e) => {
                  setHovered({
                    label: feature.properties.Estado,
                    detail: flatFill ? undefined : `Região ${macro?.name} — score ${macro?.score.total ?? "–"}`,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
                onPointerLeave={() => setHovered(null)}
                onClick={
                  flatFill
                    ? undefined
                    : () =>
                        onSelectState({
                          sigla: feature.properties.SIGLA,
                          name: feature.properties.Estado,
                          macroCode: feature.properties.FK_macro,
                        })
                }
              />
            )
          })}

          {cities.map((city) => {
            const point = projectCity(city.lat, city.lng)
            if (!point) return null
            const [x, y] = point
            const isTop = cities[0]?.id === city.id

            return (
              <g
                key={city.id}
                transform={`translate(${x}, ${y}) scale(${1 / transform.k})`}
                className="cursor-pointer"
                onPointerMove={(e) => {
                  setHovered({
                    label: city.name,
                    detail: `Score ${city.score.total} · ${city.highlight}`,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
                onPointerLeave={() => setHovered(null)}
                onClick={() =>
                  onSelectState({
                    sigla: city.state,
                    name: city.name,
                    macroCode: siglaToMacro[city.state],
                  })
                }
              >
                <circle
                  r={isTop ? 7 : 5}
                  fill="var(--map-marker)"
                  stroke="var(--map-surface)"
                  strokeWidth={2}
                />
              </g>
            )
          })}

          {datacenters?.map((dc) => {
            const point = projectCity(dc.lat, dc.lng)
            if (!point) return null
            const [x, y] = point
            const isSelected = selectedDatacenterId === dc.id
            const usedPct = Math.round((dc.usedCapacityUnits / dc.totalCapacityUnits) * 100)
            const size = (isSelected ? 11 : 9) / transform.k

            return (
              <g
                key={dc.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onPointerMove={(e) => {
                  setHovered({
                    label: `${dc.name} (existente)`,
                    detail: `${dc.operator} · uso ${usedPct}% · ${dc.totalCapacityUnits - dc.usedCapacityUnits} unidades livres`,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
                onPointerLeave={() => setHovered(null)}
                onClick={() => onSelectDatacenter?.(dc)}
              >
                <rect
                  x={-size / 2}
                  y={-size / 2}
                  width={size}
                  height={size}
                  fill="var(--chart-series-2)"
                  stroke={flatFill ? "var(--map-flat-fill)" : "var(--map-surface)"}
                  strokeWidth={2 / transform.k}
                  transform="rotate(45)"
                />
              </g>
            )
          })}
        </g>
      </svg>

      {(cities.length > 0 || (datacenters && datacenters.length > 0)) && (
        <div className="mt-3 flex items-center gap-4 text-[11px] text-black/50 dark:text-white/50">
          {cities.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--map-marker)" }} />
              Site candidato (construir)
            </span>
          )}
          {datacenters && datacenters.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rotate-45"
                style={{ background: "var(--chart-series-2)" }}
              />
              Datacenter existente
            </span>
          )}
        </div>
      )}

      {hovered && (
        <div
          className="pointer-events-none fixed z-10 max-w-64 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-neutral-900"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <p className="font-semibold">{hovered.label}</p>
          {hovered.detail && <p className="mt-0.5 text-black/70 dark:text-white/70">{hovered.detail}</p>}
        </div>
      )}
    </div>
  )
}
