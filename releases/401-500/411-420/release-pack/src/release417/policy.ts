import type { OfflineUpdateAndPatchGovernance } from "./contracts";

export interface Release417Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateOfflineUpdateAndPatchGovernance(value: OfflineUpdateAndPatchGovernance): Release417Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_417_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
