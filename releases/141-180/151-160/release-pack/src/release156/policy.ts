import type { ServiceRequest } from "./contracts";

export interface Release156Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateServiceRequest(value: ServiceRequest): Release156Decision {
  if (value.writeAction && !value.approvalId) return { allowed: false, reason: "write_requires_approval", obligations: ["human_approval"] };
  return { allowed: true, reason: "release_156_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
