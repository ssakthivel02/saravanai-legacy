import type { KeyAndCertificateLifecycleAutomation } from "./contracts";

export interface Release322Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateKeyAndCertificateLifecycleAutomation(value: KeyAndCertificateLifecycleAutomation): Release322Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_322_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
