import Link from "next/link"
import { getRegionsForMonth } from "@/server/services/regionService"
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace"

export default function DashboardPage() {
  const regions = getRegionsForMonth(new Date().getMonth() + 1)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Monitoramento
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-3xl text-black/70 dark:text-white/70">
          Monitore o consumo da sua operação atual e receba a recomendação do modelo preditivo da
          CARLA para a região onde você já está — sem precisar migrar nada.
        </p>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          <Link href="/datacenters" className="underline underline-offset-2">
            Ainda não tem datacenter? Veja o Mapa Regional.
          </Link>
        </p>
      </header>

      <div className="mt-8">
        <DashboardWorkspace regions={regions} />
      </div>
    </div>
  )
}
