import type { KnowledgeConflictAndCanonicalResolution } from "./contracts";

export interface Release628Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateKnowledgeConflictAndCanonicalResolution(value: KnowledgeConflictAndCanonicalResolution): Release628Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_628_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
