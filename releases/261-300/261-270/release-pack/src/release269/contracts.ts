export interface AutomationMetric {
  metricId: string;
  automationId: string;
  owner: string;
  metric: string;
  baselineValue: number;
  currentValue: number;
  evidenceRefs: string[];
  asOf: string;
}

export const RELEASE_269_CONTROLS = ["owner_required", "baseline_required", "evidence_required", "freshness_required"] as const;

export function validateAutomationMetric(value: AutomationMetric): string[] {
  const errors: string[] = [];
  if (!value.metricId.trim()) errors.push("metricId_required");
  if (!value.automationId.trim()) errors.push("automationId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.metric.trim()) errors.push("metric_required");
  if (!Number.isFinite(value.baselineValue) || value.baselineValue < 0) errors.push("baselineValue_invalid");
  if (!Number.isFinite(value.currentValue) || value.currentValue < 0) errors.push("currentValue_invalid");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.asOf.trim()) errors.push("asOf_required");
  return [...new Set(errors)];
}
