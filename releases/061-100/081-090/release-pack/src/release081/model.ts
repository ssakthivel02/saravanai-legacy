export interface PrivacyRule {
  ruleId: string;
  tenantId: string;
  purpose: string;
  dataClasses: string[];
  regions: string[];
  legalBasis: string;
  retentionDays: number;
  rightsSupported: string[];
  status: "draft" | "approved" | "retired";
}

export const RELEASE_081 = {
  id: "081",
  title: "Global Privacy Orchestration",
  objective: "Apply purpose, consent, retention and rights rules consistently across tenants, services, regions and data classes.",
  resource: "privacy-rules"
} as const;
