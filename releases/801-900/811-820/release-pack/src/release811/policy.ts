import type { AIGatewayRequestEnvelope } from "./contracts";

export interface Release811Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAIGatewayRequestEnvelope(value: AIGatewayRequestEnvelope): Release811Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_811_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
