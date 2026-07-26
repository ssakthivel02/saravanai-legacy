export interface SupportCase {
  caseId: string;
  tenantId: string;
  severity: "P1" | "P2" | "P3" | "P4";
  status: "open" | "investigating" | "waiting" | "resolved" | "closed";
  owner: string;
  slaDueAt: string;
  sensitiveDataPresent: boolean;
  evidenceIds: string[];
}

export const RELEASE_073 = {
  id: "073",
  title: "Customer Support Operations",
  objective: "Manage support cases, service levels, secure evidence, escalations and customer communications without leaking sensitive data.",
  resource: "support-cases"
} as const;
