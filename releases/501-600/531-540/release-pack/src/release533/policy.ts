import type { ImmutableBackupVerificationV2 } from "./contracts";

export interface Release533Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateImmutableBackupVerificationV2(value: ImmutableBackupVerificationV2): Release533Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_533_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
