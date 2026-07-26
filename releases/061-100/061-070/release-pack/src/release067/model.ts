export interface DecisionRecord {
  decisionId: string;
  tenantId: string;
  decisionType: string;
  outcome: string;
  alternatives: string[];
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  accountableOwner: string;
}

export const RELEASE_067 = {
  id: "067",
  title: "Decision Intelligence and Explainability",
  objective: "Record decisions, alternatives, evidence, policy versions, explanations, uncertainty and accountable human owners.",
  resource: "decision-records"
} as const;
