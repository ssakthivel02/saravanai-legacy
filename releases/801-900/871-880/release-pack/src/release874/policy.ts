import type { SimulationExecutionSandboxRuntime } from "./contracts";

export interface Release874Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateSimulationExecutionSandboxRuntime(value: SimulationExecutionSandboxRuntime): Release874Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_874_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
