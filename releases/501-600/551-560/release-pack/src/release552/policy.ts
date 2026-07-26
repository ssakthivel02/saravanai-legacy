import type { EmailAndCalendarAutomationSafety } from "./contracts";

export interface Release552Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateEmailAndCalendarAutomationSafety(value: EmailAndCalendarAutomationSafety): Release552Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_552_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
