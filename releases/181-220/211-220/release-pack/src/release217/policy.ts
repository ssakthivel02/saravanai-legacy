import type { TechnologyEvaluation } from "./contracts";

export interface Release217Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateTechnologyEvaluation(value: TechnologyEvaluation): Release217Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_217_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
