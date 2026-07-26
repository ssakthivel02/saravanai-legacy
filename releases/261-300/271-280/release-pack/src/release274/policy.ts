import type { LanguageAsset } from "./contracts";

export interface Release274Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateLanguageAsset(value: LanguageAsset): Release274Decision {
  if (typeof value.confidence === "number" && value.confidence < 0.7) return { allowed: false, reason: "low_confidence", obligations: ["human_review"] };
  return { allowed: true, reason: "release_274_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
