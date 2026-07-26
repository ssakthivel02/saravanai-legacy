import type { AgentExecutionRequestAndPurposeContract } from "./contracts";

export interface Release821Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAgentExecutionRequestAndPurposeContract(value: AgentExecutionRequestAndPurposeContract): Release821Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_821_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
