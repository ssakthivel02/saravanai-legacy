import type { PrimarySourceAcquisitionAndPreservation } from "./contracts";

export interface Release713Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluatePrimarySourceAcquisitionAndPreservation(value: PrimarySourceAcquisitionAndPreservation): Release713Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_713_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
