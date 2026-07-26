export interface TransparencyReport {
  reportId: string;
  periodStart: string;
  periodEnd: string;
  owner: string;
  metricEvidenceRefs: string[];
  limitations: string[];
  redressChannels: string[];
  status: 'draft' | 'reviewed' | 'published';
}

export const RELEASE_209_CONTROLS = ["period_required", "evidence_required", "limitations_disclosed", "redress_available"] as const;

export function validateTransparencyReport(value: TransparencyReport): string[] {
  const errors: string[] = [];
  if (!value.reportId.trim()) errors.push("reportId_required");
  if (!value.periodStart.trim()) errors.push("periodStart_required");
  if (!value.periodEnd.trim()) errors.push("periodEnd_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.metricEvidenceRefs.length) errors.push("metricEvidenceRefs_required");
  if (!value.limitations.length) errors.push("limitations_required");
  if (!value.redressChannels.length) errors.push("redressChannels_required");
  return [...new Set(errors)];
}
