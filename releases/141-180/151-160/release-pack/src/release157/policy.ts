import type { UsageRecord } from "./contracts";

export interface Release157Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateUsageRecord(value: UsageRecord): Release157Decision {
  if (value.billingEnabled !== false) return { allowed: false, reason: "billing_disabled", obligations: ["owner_review"] };
  return { allowed: true, reason: "release_157_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
