import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              CARLA
            </div>
            <p className="mt-2 max-w-xs text-sm text-black/60 dark:text-white/60">
              Modelo preditivo de energia limpa para agendamento de cargas computacionais e
              localização de datacenters no Brasil.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
              Produto
            </p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
              <Link href="/dashboard" className="hover:text-black dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/datacenters" className="hover:text-black dark:hover:text-white">
                Mapa Regional
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
              Contato
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
              <a href="mailto:contato@carla.eco" className="hover:text-black dark:hover:text-white">
                contato@carla.eco
              </a>
              <span>Brasil</span>
              <Link href="/contato" className="hover:text-black dark:hover:text-white">
                Fale conosco →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-black/10 pt-6 text-xs text-black/40 dark:border-white/10 dark:text-white/40">
          CARLA — Sustentabilidade Tecnológica. Dados e cenários para fins de demonstração.
        </p>
      </div>
    </footer>
  )
}
