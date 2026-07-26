import type { ToolLeaseAndScopedCapabilityRuntime } from "./contracts";

export interface Release823Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateToolLeaseAndScopedCapabilityRuntime(value: ToolLeaseAndScopedCapabilityRuntime): Release823Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_823_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
