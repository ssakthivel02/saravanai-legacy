export interface RiskComplianceIndicator {
  indicatorId: string;
  owner: string;
  domain: string;
  value: number;
  target: number;
  evidenceRefs: string[];
  asOf: string;
  status: 'healthy' | 'at_risk' | 'failed';
}

export const RELEASE_289_CONTROLS = ["owner_required", "target_required", "evidence_required", "freshness_required"] as const;

export function validateRiskComplianceIndicator(value: RiskComplianceIndicator): string[] {
  const errors: string[] = [];
  if (!value.indicatorId.trim()) errors.push("indicatorId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.domain.trim()) errors.push("domain_required");
  if (!Number.isFinite(value.value) || value.value < 0) errors.push("value_invalid");
  if (!Number.isFinite(value.target) || value.target < 0) errors.push("target_invalid");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.asOf.trim()) errors.push("asOf_required");
  if (value.target < 0 || value.target > 1) errors.push("target_out_of_range");
  return [...new Set(errors)];
}
