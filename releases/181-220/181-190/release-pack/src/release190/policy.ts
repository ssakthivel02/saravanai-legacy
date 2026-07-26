import type { AiProductionGate } from "./contracts";

export interface Release190Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAiProductionGate(value: AiProductionGate): Release190Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_190_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
