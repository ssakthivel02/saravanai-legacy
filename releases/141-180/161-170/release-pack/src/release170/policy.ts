import type { PlatformGate } from "./contracts";

export interface Release170Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluatePlatformGate(value: PlatformGate): Release170Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_170_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
