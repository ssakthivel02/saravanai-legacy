import type { ToolInvocationGateway } from "./contracts";

export interface Release614Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateToolInvocationGateway(value: ToolInvocationGateway): Release614Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_614_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
