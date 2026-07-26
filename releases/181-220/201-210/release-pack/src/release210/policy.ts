import type { TrustResilienceGate } from "./contracts";

export interface Release210Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateTrustResilienceGate(value: TrustResilienceGate): Release210Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_210_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
