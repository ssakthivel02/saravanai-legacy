import type { GaReadinessDecision } from "./contracts";

export interface Release299Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateGaReadinessDecision(value: GaReadinessDecision): Release299Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_299_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
