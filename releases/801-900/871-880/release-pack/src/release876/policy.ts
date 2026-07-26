import type { OperationalForecastAndCapacitySimulation } from "./contracts";

export interface Release876Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateOperationalForecastAndCapacitySimulation(value: OperationalForecastAndCapacitySimulation): Release876Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_876_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
