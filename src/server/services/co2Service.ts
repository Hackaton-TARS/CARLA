import type { Co2Estimate } from "@/server/types"

// Illustrative reference price for voluntary carbon credits (order of magnitude;
// Brazil's regulated market — SBCE, Lei 15.042/2024 — is still being implemented
// and has no settled clearing price yet). Real deployments should pull this from
// a market feed rather than hardcode it.
const CARBON_CREDIT_PRICE_BRL = 55

/**
 * CO2 avoided by shifting `kwhShifted` kWh from a dirty hour to a clean hour is
 * driven by the *marginal* intensity delta between those two hours — not by the
 * grid's flat average factor. Applying the average factor would imply the shifted
 * energy became zero-carbon, which overstates savings: it only got cleaner by the
 * gap between the two specific hours.
 */
export function estimateCo2Savings(kwhShifted: number, intensityDeltaGPerKwh: number): Co2Estimate {
  const deltaKgPerKwh = Math.max(0, intensityDeltaGPerKwh) / 1000
  const co2AvoidedKg = kwhShifted * deltaKgPerKwh
  const co2AvoidedTonnes = co2AvoidedKg / 1000
  const carbonCreditsEstimate = co2AvoidedTonnes
  const valueEstimateBRL = carbonCreditsEstimate * CARBON_CREDIT_PRICE_BRL

  return {
    kwhShifted: Math.round(kwhShifted * 10) / 10,
    intensityDeltaGPerKwh: Math.round(intensityDeltaGPerKwh),
    co2AvoidedKg: Math.round(co2AvoidedKg * 100) / 100,
    co2AvoidedTonnes: Math.round(co2AvoidedTonnes * 10000) / 10000,
    carbonCreditsEstimate: Math.round(carbonCreditsEstimate * 10000) / 10000,
    valueEstimateBRL: Math.round(valueEstimateBRL * 100) / 100,
  }
}
