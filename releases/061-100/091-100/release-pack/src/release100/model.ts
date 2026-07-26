export interface EnterpriseLaunchDecision {
  decisionId: string;
  version: "1.0";
  domainStatus: Record<string, "pending" | "passed" | "failed">;
  evidenceIndexSha256: string;
  residualRisks: string[];
  rollbackRef: string;
  decision: "go" | "conditional_go" | "no_go";
  approvedBy: string[];
  decidedAt: string;
}

export const RELEASE_100 = {
  id: "100",
  title: "SakthiAI Enterprise Edition v1.0 Launch Gate",
  objective: "Provide the final owner-controlled launch decision across security, privacy, safety, resilience, accessibility, operations and evidence.",
  resource: "enterprise-launch-decisions"
} as const;
