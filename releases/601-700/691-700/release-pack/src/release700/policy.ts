import type { SakthiAIEnterprisePlatformV6CompletionGate } from "./contracts";

export interface Release700Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateSakthiAIEnterprisePlatformV6CompletionGate(value: SakthiAIEnterprisePlatformV6CompletionGate): Release700Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_700_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
