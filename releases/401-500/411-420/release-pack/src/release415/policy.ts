import type { LocalRetrievalAndKnowledgeSynchronisation } from "./contracts";

export interface Release415Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateLocalRetrievalAndKnowledgeSynchronisation(value: LocalRetrievalAndKnowledgeSynchronisation): Release415Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_415_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
