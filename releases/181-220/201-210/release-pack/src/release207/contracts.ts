export interface AbuseCase {
  caseId: string;
  tenantId: string;
  category: string;
  riskScore: number;
  signalRefs: string[];
  action: 'monitor' | 'limit' | 'suspend' | 'close';
  appealAvailable: true;
  owner: string;
}

export const RELEASE_207_CONTROLS = ["risk_bounded", "signals_required", "proportionate_action_required", "appeal_required"] as const;

export function validateAbuseCase(value: AbuseCase): string[] {
  const errors: string[] = [];
  if (!value.caseId.trim()) errors.push("caseId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.category.trim()) errors.push("category_required");
  if (!Number.isFinite(value.riskScore) || value.riskScore < 0) errors.push("riskScore_invalid");
  if (!value.signalRefs.length) errors.push("signalRefs_required");
  if (value.appealAvailable !== true) errors.push("appealAvailable_must_remain_true");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.riskScore < 0 || value.riskScore > 100) errors.push("risk_score_out_of_range");
  return [...new Set(errors)];
}
