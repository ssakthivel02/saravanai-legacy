export interface RemediationPlan {
  planId: string;
  service: string;
  trigger: string;
  actions: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  approvalId: string | undefined;
  rollbackRef: string;
  status: "proposed" | "approved" | "executing" | "completed" | "failed";
}

export const RELEASE_092 = {
  id: "092",
  title: "Self-Healing Operations",
  objective: "Detect operational faults, propose bounded remediation, require approval for risky actions and preserve rollback evidence.",
  resource: "remediation-plans"
} as const;
