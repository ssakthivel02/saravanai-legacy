export interface SupplierRecord {
  supplierId: string;
  service: string;
  owner: string;
  riskRating: number;
  subprocessors: string[];
  exitPlanId: string;
  reviewAt: string;
}

export const RELEASE_158_CONTROLS = ["owner_required", "exit_plan_required", "review_date_required"] as const;

export function validateSupplierRecord(value: SupplierRecord): string[] {
  const errors: string[] = [];
  if (!value.supplierId.trim()) errors.push("supplierId_required");
  if (!value.service.trim()) errors.push("service_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!Number.isFinite(value.riskRating) || value.riskRating < 0) errors.push("riskRating_invalid");
  if (!value.subprocessors.length) errors.push("subprocessors_required");
  if (!value.exitPlanId.trim()) errors.push("exitPlanId_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
