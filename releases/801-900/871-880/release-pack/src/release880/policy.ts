import type { DigitalTwinAndSimulationActivationGate } from "./contracts";

export interface Release880Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDigitalTwinAndSimulationActivationGate(value: DigitalTwinAndSimulationActivationGate): Release880Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_880_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
