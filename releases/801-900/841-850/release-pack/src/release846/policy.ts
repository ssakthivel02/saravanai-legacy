import type { NotificationPreferenceAndDeliveryRuntime } from "./contracts";

export interface Release846Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateNotificationPreferenceAndDeliveryRuntime(value: NotificationPreferenceAndDeliveryRuntime): Release846Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_846_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
