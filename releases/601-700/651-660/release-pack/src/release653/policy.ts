import type { EphemeralCodeExecutionSandbox } from "./contracts";

export interface Release653Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateEphemeralCodeExecutionSandbox(value: EphemeralCodeExecutionSandbox): Release653Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_653_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
