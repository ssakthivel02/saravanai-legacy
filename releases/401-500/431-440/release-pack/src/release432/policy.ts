import type { DataIngestionAndChangeDataCapture } from "./contracts";

export interface Release432Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDataIngestionAndChangeDataCapture(value: DataIngestionAndChangeDataCapture): Release432Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_432_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
