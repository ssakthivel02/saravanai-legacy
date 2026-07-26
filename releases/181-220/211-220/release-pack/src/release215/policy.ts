import type { InnovationInitiative } from "./contracts";

export interface Release215Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateInnovationInitiative(value: InnovationInitiative): Release215Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_215_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
