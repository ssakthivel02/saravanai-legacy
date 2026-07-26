export interface AIImpactAssessment {
  assessmentId: string;
  systemId: string;
  intendedUse: string;
  affectedGroups: string[];
  benefits: string[];
  harms: string[];
  mitigations: string[];
  riskTier: "low" | "medium" | "high" | "prohibited";
  approvedBy: string | undefined;
}

export const RELEASE_086 = {
  id: "086",
  title: "AI Ethics and Impact Assessment",
  objective: "Assess intended use, affected groups, benefits, harms, mitigations, human oversight, contestability and monitoring.",
  resource: "ai-impact-assessments"
} as const;
