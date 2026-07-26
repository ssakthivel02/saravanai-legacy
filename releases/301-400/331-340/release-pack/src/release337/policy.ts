import type { BuildReproducibilityAndProvenance } from "./contracts";

export interface Release337Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateBuildReproducibilityAndProvenance(value: BuildReproducibilityAndProvenance): Release337Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_337_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
