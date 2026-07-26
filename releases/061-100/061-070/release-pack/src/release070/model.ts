export interface IntelligenceGate {
  gateId: string;
  releaseId: string;
  domains: Record<string, "pending" | "passed" | "failed" | "waived">;
  evidenceIds: string[];
  residualRisks: string[];
  approvedBy: string | undefined;
  approvedAt: string | undefined;
}

export const RELEASE_070 = {
  id: "070",
  title: "Intelligence Assurance Gate",
  objective: "Provide a formal gate for model routing, multimodal safety, evidence integrity, explainability, code safety and human approval.",
  resource: "intelligence-gates"
} as const;
