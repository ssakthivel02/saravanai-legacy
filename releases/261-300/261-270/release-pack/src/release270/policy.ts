import type { AutomationGate } from "./contracts";

export interface Release270Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAutomationGate(value: AutomationGate): Release270Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_270_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
