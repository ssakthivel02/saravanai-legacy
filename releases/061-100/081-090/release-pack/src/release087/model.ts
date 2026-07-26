export interface RegulatoryObligation {
  obligationId: string;
  jurisdiction: string;
  sourceRef: string;
  effectiveAt: string;
  applicability: "applicable" | "not_applicable" | "uncertain";
  controlIds: string[];
  legalOwner: string;
  status: "identified" | "assessed" | "implemented" | "verified";
}

export const RELEASE_087 = {
  id: "087",
  title: "Regulatory Change Management",
  objective: "Track regulatory obligations, applicability, interpretation, control impact, implementation, evidence and legal review.",
  resource: "regulatory-obligations"
} as const;
