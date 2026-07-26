export interface DashboardIndicator {
  indicatorId: string;
  name: string;
  owner: string;
  value: number;
  asOf: string;
  evidenceRefs: string[];
  confidence: number;
}

export const RELEASE_148_CONTROLS = ["owner_required", "freshness_required", "provenance_required"] as const;

export function validateDashboardIndicator(value: DashboardIndicator): string[] {
  const errors: string[] = [];
  if (!value.indicatorId.trim()) errors.push("indicatorId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!Number.isFinite(value.value) || value.value < 0) errors.push("value_invalid");
  if (!value.asOf.trim()) errors.push("asOf_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
