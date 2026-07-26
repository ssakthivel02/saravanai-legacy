export interface EcosystemGate {
  gateId: string;
  releaseId: string;
  capabilityStatus: Record<string, "pending" | "passed" | "failed">;
  evidenceIds: string[];
  supplierRisksAccepted: boolean;
  approvedBy: string | undefined;
}

export const RELEASE_080 = {
  id: "080",
  title: "Ecosystem Readiness Gate",
  objective: "Gate marketplace, processes, support, communications, publishing, learning, analytics, data products and supplier risk before ecosystem launch.",
  resource: "ecosystem-gates"
} as const;
