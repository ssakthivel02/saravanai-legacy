import type { ProgrammeClosure } from "./contracts";

export interface Release300Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateProgrammeClosure(value: ProgrammeClosure): Release300Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_300_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
