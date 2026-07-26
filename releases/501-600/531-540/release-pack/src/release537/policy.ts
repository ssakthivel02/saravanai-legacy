import type { ApplicationRebuildFactory } from "./contracts";

export interface Release537Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateApplicationRebuildFactory(value: ApplicationRebuildFactory): Release537Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_537_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
