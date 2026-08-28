import type { MacroRegion } from "@/server/types"

export const MACRO_REGIONS: MacroRegion[] = [
  {
    code: "N",
    name: "Norte",
    mix: { hydro: 75, solar: 2, wind: 1, other: 22 },
    waterAvailability: 88,
    baseTempC: 27,
    tempAmplitudeC: 2,
    curtailmentIndex: 5,
  },
  {
    code: "NE",
    name: "Nordeste",
    mix: { hydro: 32, solar: 25, wind: 33, other: 10 },
    waterAvailability: 45,
    baseTempC: 26,
    tempAmplitudeC: 3,
    curtailmentIndex: 42,
  },
  {
    code: "CO",
    name: "Centro-Oeste",
    mix: { hydro: 58, solar: 20, wind: 2, other: 20 },
    waterAvailability: 55,
    baseTempC: 23,
    tempAmplitudeC: 5,
    curtailmentIndex: 15,
  },
  {
    code: "SE",
    name: "Sudeste",
    mix: { hydro: 55, solar: 6, wind: 2, other: 37 },
    waterAvailability: 50,
    baseTempC: 21,
    tempAmplitudeC: 6,
    curtailmentIndex: 6,
  },
  {
    code: "S",
    name: "Sul",
    mix: { hydro: 75, solar: 3, wind: 10, other: 12 },
    waterAvailability: 78,
    baseTempC: 18,
    tempAmplitudeC: 8,
    curtailmentIndex: 18,
  },
]
