import { NextRequest, NextResponse } from "next/server"
import { estimateCo2Savings } from "@/server/services/co2Service"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const kwhShifted = Number(body?.kwhShifted)
  const intensityDeltaGPerKwh = Number(body?.intensityDeltaGPerKwh)

  if (!body || Number.isNaN(kwhShifted) || kwhShifted < 0) {
    return NextResponse.json({ error: "kwhShifted deve ser um número >= 0" }, { status: 400 })
  }
  if (Number.isNaN(intensityDeltaGPerKwh) || intensityDeltaGPerKwh < 0) {
    return NextResponse.json(
      { error: "intensityDeltaGPerKwh deve ser um número >= 0 (gCO2/kWh entre o horário sujo e o limpo)" },
      { status: 400 },
    )
  }

  return NextResponse.json(estimateCo2Savings(kwhShifted, intensityDeltaGPerKwh))
}
