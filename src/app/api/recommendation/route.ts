import { NextResponse } from "next/server"
import { buildRecommendation } from "@/server/services/recommendationService"

export async function GET() {
  return NextResponse.json(buildRecommendation())
}
