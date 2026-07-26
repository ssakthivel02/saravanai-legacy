import type { DocumentProcess } from "./contracts";

export interface Release265Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDocumentProcess(value: DocumentProcess): Release265Decision {
  if (typeof value.confidence === "number" && value.confidence < 0.7) return { allowed: false, reason: "low_confidence", obligations: ["human_review"] };
  return { allowed: true, reason: "release_265_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
