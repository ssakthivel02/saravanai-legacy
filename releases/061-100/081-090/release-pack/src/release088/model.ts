export interface AbuseAssessment {
  assessmentId: string;
  tenantId: string;
  subjectRef: string;
  signalTypes: string[];
  riskScore: number;
  decision: "allow" | "challenge" | "limit" | "block";
  appealAvailable: boolean;
  reviewer: string | undefined;
}

export const RELEASE_088 = {
  id: "088",
  title: "Fraud Abuse and Misuse Prevention",
  objective: "Detect account abuse, automation misuse, content fraud, impersonation and anomalous behaviour with proportionate controls.",
  resource: "abuse-assessments"
} as const;
