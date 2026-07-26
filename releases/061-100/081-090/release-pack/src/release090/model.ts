export interface GlobalTrustGate {
  gateId: string;
  releaseId: string;
  domainStatus: Record<string, "pending" | "passed" | "failed" | "waived">;
  legalReviews: string[];
  evidenceIds: string[];
  residualRisks: string[];
  approvedBy: string | undefined;
}

export const RELEASE_090 = {
  id: "090",
  title: "Global Trust Assurance Gate",
  objective: "Gate privacy, regional controls, vulnerable-user safety, public-event safety, transparency, ethics, regulation, abuse and SecOps.",
  resource: "global-trust-gates"
} as const;
