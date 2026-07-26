export interface EvidenceClaim {
  claimId: string;
  tenantId: string;
  statement: string;
  sourceIds: string[];
  confidence: number;
  currentFact: boolean;
  verifiedAt: string;
  contradictionStatus: "none" | "possible" | "confirmed";
}

export const RELEASE_065 = {
  id: "065",
  title: "Citation Graph and Evidence Synthesis",
  objective: "Link every material claim to source evidence, retrieval time, content hash, confidence and contradiction status.",
  resource: "evidence-claims"
} as const;
