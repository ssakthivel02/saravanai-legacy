export interface EvidencePackage {
  packageId: string;
  releaseRange: string;
  controlIds: string[];
  evidenceIds: string[];
  checksumIndex: string;
  certificationClaim: false;
  externalAssessor: string | undefined;
  status: "draft" | "reviewed" | "ready_for_assessment";
}

export const RELEASE_099 = {
  id: "099",
  title: "Production Evidence and Certification Readiness",
  objective: "Assemble traceable evidence for external assessment while explicitly avoiding unsupported certification or legal-conformity claims.",
  resource: "evidence-packages"
} as const;
