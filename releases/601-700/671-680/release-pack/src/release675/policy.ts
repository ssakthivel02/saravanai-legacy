import type { DocumentAndFormAutomation } from "./contracts";

export interface Release675Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDocumentAndFormAutomation(value: DocumentAndFormAutomation): Release675Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_675_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
