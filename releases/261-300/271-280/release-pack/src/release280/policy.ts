import type { KnowledgeExperienceGate } from "./contracts";

export interface Release280Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateKnowledgeExperienceGate(value: KnowledgeExperienceGate): Release280Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_280_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
