export interface VisionSafetyAssessment {
  assessmentId: string;
  tenantId: string;
  assetId: string;
  riskTags: string[];
  ageBand: "child" | "teen" | "adult";
  riskScore: number;
  blocked: boolean;
  reviewer: string | undefined;
}

export const RELEASE_064 = {
  id: "064",
  title: "Vision and Media Safety",
  objective: "Classify visual risks, protect children and vulnerable users, and prevent unsafe or sensitive media from bypassing review.",
  resource: "vision-safety-assessments"
} as const;
