export interface CapacityForecast {
  forecastId: string;
  service: string;
  periodStart: string;
  periodEnd: string;
  expectedDemand: number;
  capacityLimit: number;
  energyEstimateKwh: number;
  confidence: number;
}

export const RELEASE_218_CONTROLS = ["period_required", "demand_non_negative", "capacity_recorded", "confidence_bounded"] as const;

export function validateCapacityForecast(value: CapacityForecast): string[] {
  const errors: string[] = [];
  if (!value.forecastId.trim()) errors.push("forecastId_required");
  if (!value.service.trim()) errors.push("service_required");
  if (!value.periodStart.trim()) errors.push("periodStart_required");
  if (!value.periodEnd.trim()) errors.push("periodEnd_required");
  if (!Number.isFinite(value.expectedDemand) || value.expectedDemand < 0) errors.push("expectedDemand_invalid");
  if (!Number.isFinite(value.capacityLimit) || value.capacityLimit < 0) errors.push("capacityLimit_invalid");
  if (!Number.isFinite(value.energyEstimateKwh) || value.energyEstimateKwh < 0) errors.push("energyEstimateKwh_invalid");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
