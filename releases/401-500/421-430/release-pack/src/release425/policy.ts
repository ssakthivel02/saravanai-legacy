import type { AutomatedContainmentSafety } from "./contracts";

export interface Release425Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAutomatedContainmentSafety(value: AutomatedContainmentSafety): Release425Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_425_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
