import { ContactForm } from "@/components/contato/ContactForm"

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Contato
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Fale com a CARLA</h1>
        <p className="mt-2 max-w-2xl text-black/70 dark:text-white/70">
          Quer avaliar onde construir, migrar carga para um datacenter existente, ou só entender
          melhor como o modelo preditivo funciona? Manda uma mensagem.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
              E-mail
            </p>
            <a
              href="mailto:contato@carla.eco"
              className="mt-1 block text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              contato@carla.eco
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
              Localização
            </p>
            <p className="mt-1 text-lg font-medium">Brasil</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
