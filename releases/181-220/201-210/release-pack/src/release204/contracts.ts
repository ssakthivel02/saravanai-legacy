export interface SupplyChainArtifact {
  artifactId: string;
  version: string;
  sbomRef: string;
  provenanceRef: string;
  signatureRef: string;
  dependencyCount: number;
  criticalFindings: number;
  status: 'candidate' | 'approved' | 'revoked';
}

export const RELEASE_204_CONTROLS = ["sbom_required", "provenance_required", "signature_required", "critical_findings_block"] as const;

export function validateSupplyChainArtifact(value: SupplyChainArtifact): string[] {
  const errors: string[] = [];
  if (!value.artifactId.trim()) errors.push("artifactId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.sbomRef.trim()) errors.push("sbomRef_required");
  if (!value.provenanceRef.trim()) errors.push("provenanceRef_required");
  if (!value.signatureRef.trim()) errors.push("signatureRef_required");
  if (!Number.isFinite(value.dependencyCount) || value.dependencyCount < 0) errors.push("dependencyCount_invalid");
  if (!Number.isFinite(value.criticalFindings) || value.criticalFindings < 0) errors.push("criticalFindings_invalid");
  return [...new Set(errors)];
}
