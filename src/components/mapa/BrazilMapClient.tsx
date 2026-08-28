"use client"

import dynamic from "next/dynamic"

/**
 * BrazilMap does floating-point projection math (d3-geo) that can differ by a
 * few ULPs between the server's JS engine and the browser's, which React's
 * hydration diff flags as a mismatch on the SVG transform attributes. The map
 * is fully interactive anyway (zoom/pan/click) and useless before JS loads,
 * so skip SSR for it entirely rather than chase float precision.
 */
export const BrazilMap = dynamic(() => import("./BrazilMap").then((m) => m.BrazilMap), {
  ssr: false,
  loading: () => (
    <div className="aspect-square w-full animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
  ),
})
