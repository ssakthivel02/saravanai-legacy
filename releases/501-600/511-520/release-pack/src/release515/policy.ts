import type { DocumentAndPDFGenerationPipeline } from "./contracts";

export interface Release515Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDocumentAndPDFGenerationPipeline(value: DocumentAndPDFGenerationPipeline): Release515Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_515_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
