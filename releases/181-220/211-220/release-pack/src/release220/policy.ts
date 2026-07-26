import type { EnterpriseIntelligenceClosure } from "./contracts";

export interface Release220Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateEnterpriseIntelligenceClosure(value: EnterpriseIntelligenceClosure): Release220Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_220_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
