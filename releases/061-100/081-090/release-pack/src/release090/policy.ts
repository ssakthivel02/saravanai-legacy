import type { GlobalTrustGate } from "./model";

export const RELEASE_090_CONTROL_RULES = ["mandatory_domains_pass", "legal_reviews_complete", "evidence_required", "waiver_requires_expiry", "owner_approval_required"] as const;

export function validateGlobalTrustGate(input: GlobalTrustGate): string[] {
  const errors: string[] = [];
  if (!String(input.gateId ?? "").trim()) errors.push("gateId_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  return [...new Set(errors)];
}

export function release090Ready(input: GlobalTrustGate): boolean {
  return validateGlobalTrustGate(input).length === 0;
}
