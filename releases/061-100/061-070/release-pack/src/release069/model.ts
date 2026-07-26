export interface CodeAnalysisFinding {
  findingId: string;
  tenantId: string;
  repositoryRef: string;
  path: string;
  ruleId: string;
  severity: "low" | "medium" | "high" | "critical";
  secretMaterialPresent: boolean;
  status: "open" | "accepted" | "fixed" | "verified";
}

export const RELEASE_069 = {
  id: "069",
  title: "Secure Code Intelligence",
  objective: "Analyse code without exposing secrets, enforce repository boundaries, classify findings and require review before remediation.",
  resource: "code-findings"
} as const;
