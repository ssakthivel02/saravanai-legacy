import type { CompensatingActionAndRollbackExecutor } from "./contracts";

export interface Release827Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateCompensatingActionAndRollbackExecutor(value: CompensatingActionAndRollbackExecutor): Release827Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_827_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
