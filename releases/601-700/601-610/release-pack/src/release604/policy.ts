import type { InferenceRequestAdmissionControl } from "./contracts";

export interface Release604Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateInferenceRequestAdmissionControl(value: InferenceRequestAdmissionControl): Release604Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_604_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
