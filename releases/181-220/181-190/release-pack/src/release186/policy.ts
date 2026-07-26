import type { ToolInvocation } from "./contracts";

export interface Release186Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateToolInvocation(value: ToolInvocation): Release186Decision {
  if (value.writeAction && !value.approvalId) return { allowed: false, reason: "write_requires_approval", obligations: ["human_approval"] };
  return { allowed: true, reason: "release_186_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
