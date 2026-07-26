import type { AgentKillSwitchAndEmergencyStop } from "./contracts";

export interface Release828Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAgentKillSwitchAndEmergencyStop(value: AgentKillSwitchAndEmergencyStop): Release828Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_828_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
