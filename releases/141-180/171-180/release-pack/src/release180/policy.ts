import type { ScaleClosure } from "./contracts";

export interface Release180Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateScaleClosure(value: ScaleClosure): Release180Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_180_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
