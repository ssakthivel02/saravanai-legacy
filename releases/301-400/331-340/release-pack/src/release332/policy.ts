import type { GitOpsEnvironmentPromotion } from "./contracts";

export interface Release332Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateGitOpsEnvironmentPromotion(value: GitOpsEnvironmentPromotion): Release332Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_332_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
