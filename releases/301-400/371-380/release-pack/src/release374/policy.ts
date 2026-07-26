import type { ChaosExperimentGovernanceV2 } from "./contracts";

export interface Release374Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateChaosExperimentGovernanceV2(value: ChaosExperimentGovernanceV2): Release374Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_374_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
