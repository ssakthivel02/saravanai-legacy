import type { SessionRevocationAndDeviceTrust } from "./contracts";

export interface Release807Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateSessionRevocationAndDeviceTrust(value: SessionRevocationAndDeviceTrust): Release807Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_807_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
