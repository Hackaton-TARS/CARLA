"use client"

import { useState } from "react"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-sm text-emerald-700 dark:text-emerald-400">
        Mensagem enviada. Nosso time responde em breve, {name || "obrigado pelo contato"}.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-black/60 dark:text-white/60">
            Nome
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-black/60 dark:text-white/60">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-xs font-medium text-black/60 dark:text-white/60">
          Mensagem
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Enviar mensagem
      </button>
    </form>
  )
}
