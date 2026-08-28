import { NextResponse } from "next/server"
import { getRegionById, getRegionYearCurve } from "@/server/services/regionService"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const region = getRegionById(id)
  const curve = getRegionYearCurve(id)

  if (!region || !curve) {
    return NextResponse.json({ error: "Região não encontrada" }, { status: 404 })
  }

  return NextResponse.json({ region, curve })
}
