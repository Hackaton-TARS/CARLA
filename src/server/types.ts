export type EnergyMix = {
  hydro: number
  solar: number
  wind: number
  other: number
}

export type EnergyProfile = {
  mix: EnergyMix
  waterAvailability: number
  baseTempC: number
  tempAmplitudeC: number
  /** 0-100 — how much clean generation is curtailed (wasted) in this area today. Higher = more "free" clean capacity already being produced and unused, e.g. Nordeste wind/solar. */
  curtailmentIndex: number
}

export type Region = EnergyProfile & {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  highlight: string
  image: string
}

export type MacroRegionCode = "N" | "NE" | "CO" | "SE" | "S"

export type MacroRegion = EnergyProfile & {
  code: MacroRegionCode
  name: string
}

export type MonthlyScore = {
  month: number
  cleanScore: number
  coolingScore: number
  waterScore: number
  curtailmentScore: number
  total: number
  avgTempC: number
  modelConfidence: number
  dominantSource: EnergySource
}

export type RegionWithScore = Region & {
  score: MonthlyScore
}

export type MacroRegionWithScore = MacroRegion & {
  score: MonthlyScore
}

export type ConsumptionPoint = {
  hour: number
  kwh: number
  gridCarbonIntensity: number
}

export type EnergySource = "solar" | "wind" | "hydro"

export type RecommendationWindow = {
  startHour: number
  endHour: number
  avgCarbonIntensity: number
  label: string
}

export type Recommendation = {
  windows: RecommendationWindow[]
  worstHour: number
  bestHour: number
  bestIntensity: number
  worstIntensity: number
  potentialCo2SavingsKg: number
  dominantSource: EnergySource
  sourceLabel: string
  modelConfidence: number
}

export type Co2Estimate = {
  kwhShifted: number
  intensityDeltaGPerKwh: number
  co2AvoidedKg: number
  co2AvoidedTonnes: number
  carbonCreditsEstimate: number
  valueEstimateBRL: number
}

export type Datacenter = {
  id: string
  name: string
  operator: string
  city: string
  state: string
  lat: number
  lng: number
  totalCapacityUnits: number
  usedCapacityUnits: number
}
