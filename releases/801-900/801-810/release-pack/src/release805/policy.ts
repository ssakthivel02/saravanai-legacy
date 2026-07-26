import type { PrivilegedSessionAndStepUpControl } from "./contracts";

export interface Release805Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluatePrivilegedSessionAndStepUpControl(value: PrivilegedSessionAndStepUpControl): Release805Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_805_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
