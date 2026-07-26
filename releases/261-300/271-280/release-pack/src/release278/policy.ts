import type { HeritageKnowledgeClaim } from "./contracts";

export interface Release278Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateHeritageKnowledgeClaim(value: HeritageKnowledgeClaim): Release278Decision {
  if (typeof value.confidence === "number" && value.confidence < 0.7) return { allowed: false, reason: "low_confidence", obligations: ["human_review"] };
  return { allowed: true, reason: "release_278_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
