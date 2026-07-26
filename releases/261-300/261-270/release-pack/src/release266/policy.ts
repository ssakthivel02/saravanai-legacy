import type { CommunicationAction } from "./contracts";

export interface Release266Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateCommunicationAction(value: CommunicationAction): Release266Decision {
  if (value.externalSend && !value.approvalId) return { allowed: false, reason: "external_send_requires_approval", obligations: ["human_approval"] };
  return { allowed: true, reason: "release_266_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
