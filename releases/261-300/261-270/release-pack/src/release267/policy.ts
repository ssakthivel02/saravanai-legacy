import type { RpaExecution } from "./contracts";

export interface Release267Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateRpaExecution(value: RpaExecution): Release267Decision {
  if (value.productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_267_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
