import type { MetricDefinition } from "./model";

export const RELEASE_077_CONTROL_RULES = ["metric_owner_required", "unit_required", "minimum_cohort_enforced", "personal_data_must_be_false", "explanation_required_for_anomaly"] as const;

export function validateMetricDefinition(input: MetricDefinition): string[] {
  const errors: string[] = [];
  if (!String(input.metricId ?? "").trim()) errors.push("metricId_required");
  if (input.personalDataAllowed !== false) errors.push("personalDataAllowed_must_be_false");
  return [...new Set(errors)];
}

export function release077Ready(input: MetricDefinition): boolean {
  return validateMetricDefinition(input).length === 0;
}
