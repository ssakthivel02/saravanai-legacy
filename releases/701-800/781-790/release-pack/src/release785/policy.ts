import type { ExecutiveDecisionBriefAndBoardPack } from "./contracts";

export interface Release785Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateExecutiveDecisionBriefAndBoardPack(value: ExecutiveDecisionBriefAndBoardPack): Release785Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_785_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
