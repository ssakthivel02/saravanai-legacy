import type { ProductionChangeAndReleaseControlV3 } from "./contracts";

export interface Release597Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateProductionChangeAndReleaseControlV3(value: ProductionChangeAndReleaseControlV3): Release597Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_597_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
