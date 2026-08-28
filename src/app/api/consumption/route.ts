import { NextResponse } from "next/server"
import { getDailyConsumption } from "@/server/data/consumption"

export async function GET() {
  return NextResponse.json({ points: getDailyConsumption() })
}
