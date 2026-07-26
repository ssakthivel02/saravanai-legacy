import type { IngestionParsingAndNormalisationPipeline } from "./contracts";

export interface Release622Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateIngestionParsingAndNormalisationPipeline(value: IngestionParsingAndNormalisationPipeline): Release622Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_622_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
