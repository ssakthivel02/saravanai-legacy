export interface ThirdPartyAssurance {
  assuranceId: string;
  supplierId: string;
  owner: string;
  service: string;
  evidenceRefs: string[];
  findingIds: string[];
  exitPlanId: string;
  reviewAt: string;
}

export const RELEASE_287_CONTROLS = ["owner_required", "evidence_required", "exit_plan_required", "review_date_required"] as const;

export function validateThirdPartyAssurance(value: ThirdPartyAssurance): string[] {
  const errors: string[] = [];
  if (!value.assuranceId.trim()) errors.push("assuranceId_required");
  if (!value.supplierId.trim()) errors.push("supplierId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.service.trim()) errors.push("service_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.findingIds.length) errors.push("findingIds_required");
  if (!value.exitPlanId.trim()) errors.push("exitPlanId_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
