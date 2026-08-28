import Link from "next/link"
import { getDailyConsumption } from "@/server/data/consumption"
import { buildRecommendation } from "@/server/services/recommendationService"
import { getRegionsForMonth } from "@/server/services/regionService"
import { getMacroRegionsForMonth } from "@/server/services/macroRegionService"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { RecommendationCard } from "@/components/dashboard/RecommendationCard"
import { RegionalMapExplorer } from "@/components/mapa/RegionalMapExplorer"
import { DATACENTERS } from "@/server/data/datacenters"
import type { MacroRegionWithScore, RegionWithScore } from "@/server/types"

const pillars = [
  {
    title: "Monitoramento",
    description:
      "Acompanhe em tempo real o consumo energético da sua operação e a intensidade de carbono da rede elétrica.",
  },
  {
    title: "Otimização preditiva",
    description:
      "Um modelo preditivo cruza consumo, clima e matriz energética para apontar as melhores janelas de horário — solar, eólica ou hídrica.",
  },
  {
    title: "Crédito de Carbono",
    description:
      "Converta CO₂ evitado em estimativa de crédito de carbono — um incentivo fiscal real para sua empresa.",
  },
  {
    title: "Localização Inteligente",
    description:
      "Descubra as melhores regiões e épocas do ano para instalar um datacenter, com base em clima e matriz energética limpa.",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Dados",
    description:
      "Consumo da operação, clima por região e composição da matriz elétrica (hidrelétrica, solar, eólica) alimentam o modelo continuamente.",
  },
  {
    step: "02",
    title: "Modelo preditivo",
    description:
      "Um motor de scoring preditivo pondera esses sinais para estimar, hora a hora e região a região, onde e quando a energia é mais limpa — com um índice de confiança para cada previsão.",
  },
  {
    step: "03",
    title: "Recomendação",
    description:
      "A saída vira ação: horário ideal para cargas pesadas, região ideal para expansão e a estimativa de CO₂/crédito de carbono correspondente.",
  },
]

const paths = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Já tem um datacenter? Monitore o consumo e receba a recomendação de horário.",
  },
  {
    href: "/datacenters",
    title: "Mapa Regional",
    description: "Adequação por região e datacenters já em operação, mês a mês.",
  },
]

export default function Home() {
  const points = getDailyConsumption()
  const recommendation = buildRecommendation()

  const monthlyRegions: Record<number, RegionWithScore[]> = {}
  const monthlyMacroRegions: Record<number, MacroRegionWithScore[]> = {}
  for (let m = 1; m <= 12; m++) {
    monthlyRegions[m] = getRegionsForMonth(m)
    monthlyMacroRegions[m] = getMacroRegionsForMonth(m)
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <span aria-hidden>◆</span> Modelo preditivo aplicado a energia limpa
        </div>
        <p className="mt-4 text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Sustentabilidade Tecnológica
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Sua operação consome energia sem saber quando ela é limpa.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-black/70 dark:text-white/70">
          Cargas computacionais rodam o dia inteiro no mesmo ritmo, mesmo quando a rede elétrica
          está mais suja e mais cara. A CARLA usa um modelo preditivo para prever, com base em
          consumo, clima e matriz energética (solar, eólica e hídrica), quando e onde a energia é
          mais limpa — e transforma isso em economia e crédito de carbono.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
          O problema, ao vivo
        </p>
        <p className="mt-1 text-sm text-black/70 dark:text-white/70">
          Consumo simulado de uma empresa nas últimas 24h — e o que a CARLA recomendaria fazer com
          ele.
        </p>
        <div className="mt-6">
          <EnergyChart points={points} />
        </div>
        <div className="mt-6">
          <RecommendationCard recommendation={recommendation} />
        </div>
      </section>

      <section className="py-16">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
          Como funciona o modelo preditivo
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <div key={item.step} className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-black/70 dark:text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
          O modelo em ação
        </p>
        <p className="mt-1 text-sm text-black/70 dark:text-white/70">
          Veja o modelo em duas camadas: a adequação prevista por região, ou onde já existem
          datacenters em operação hoje.
        </p>
        <div className="mt-6">
          <RegionalMapExplorer
            monthlyRegions={monthlyRegions}
            monthlyMacroRegions={monthlyMacroRegions}
            datacenters={DATACENTERS}
            showRanking={false}
          />
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/datacenters"
            className="text-sm font-medium text-emerald-600 underline underline-offset-2 dark:text-emerald-400"
          >
            Explorar o Mapa Regional completo, com ranking →
          </Link>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold">
          A CARLA resolve isso: monitora, otimiza e transforma economia em crédito de carbono.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="rounded-2xl border border-black/10 p-6 text-left transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5 dark:border-white/10"
            >
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {path.title}
              </h3>
              <p className="mt-2 text-sm text-black/70 dark:text-white/70">{path.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 pb-24 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
          >
            <h2 className="text-lg font-semibold">{pillar.title}</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">{pillar.description}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-black/10 py-16 dark:border-white/10">
        <h2 className="text-2xl font-semibold">Por que isso importa?</h2>
        <p className="mt-4 max-w-3xl text-black/70 dark:text-white/70">
          Datacenters consomem energia e água em larga escala. O Brasil tem uma das matrizes
          elétricas mais limpas do mundo — liderada por hidrelétricas como Itaipu, em Foz do
          Iguaçu — além de forte potencial solar e eólico no Nordeste. Ao direcionar consumo
          computacional para os horários e regiões certas, empresas reduzem custos, emissões de
          CO₂ e ganham créditos de carbono, um incentivo fiscal concreto do governo.
        </p>
      </section>
    </div>
  )
}
