export interface IdentityThreatSignal {
  signalId: string;
  tenantId: string;
  subject: string;
  signalType: string;
  riskScore: number;
  requestIds: string[];
  observedAt: string;
  status: 'open' | 'contained' | 'resolved';
}

export const RELEASE_205_CONTROLS = ["subject_required", "risk_bounded", "request_correlation_required", "high_risk_containment"] as const;

export function validateIdentityThreatSignal(value: IdentityThreatSignal): string[] {
  const errors: string[] = [];
  if (!value.signalId.trim()) errors.push("signalId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subject.trim()) errors.push("subject_required");
  if (!value.signalType.trim()) errors.push("signalType_required");
  if (!Number.isFinite(value.riskScore) || value.riskScore < 0) errors.push("riskScore_invalid");
  if (!value.requestIds.length) errors.push("requestIds_required");
  if (!value.observedAt.trim()) errors.push("observedAt_required");
  if (value.riskScore < 0 || value.riskScore > 100) errors.push("risk_score_out_of_range");
  return [...new Set(errors)];
}
