import type { WebhookDeliveryAndReplayGovernance } from "./contracts";

export interface Release523Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateWebhookDeliveryAndReplayGovernance(value: WebhookDeliveryAndReplayGovernance): Release523Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_523_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
