import { NextRequest, NextResponse } from "next/server"
import { getMacroRegionsForMonth } from "@/server/services/macroRegionService"

export async function GET(request: NextRequest) {
  const monthParam = request.nextUrl.searchParams.get("month")
  const month = monthParam ? Number(monthParam) : new Date().getMonth() + 1

  if (Number.isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "month deve ser entre 1 e 12" }, { status: 400 })
  }

  return NextResponse.json({ month, macroRegions: getMacroRegionsForMonth(month) })
}
