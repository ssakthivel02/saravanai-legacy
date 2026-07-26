export interface SupplierAssessment {
  assessmentId: string;
  supplierId: string;
  serviceCriticality: "low" | "medium" | "high" | "critical";
  securityScore: number;
  privacyScore: number;
  resilienceScore: number;
  openFindings: number;
  decision: "approve" | "conditional" | "reject";
}

export const RELEASE_079 = {
  id: "079",
  title: "Partner and Supplier Risk",
  objective: "Assess suppliers, subprocessors and partners for security, privacy, resilience, financial and concentration risk.",
  resource: "supplier-assessments"
} as const;
