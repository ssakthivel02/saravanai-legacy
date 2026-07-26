export interface TransparencyRecord {
  recordId: string;
  publicationId: string;
  sourceRefs: string[];
  limitations: string[];
  updatedAt: string;
  correctionRefs: string[];
  redressChannels: string[];
  status: 'draft' | 'published' | 'withdrawn';
}

export const RELEASE_279_CONTROLS = ["sources_required", "limitations_disclosed", "corrections_supported", "redress_available"] as const;

export function validateTransparencyRecord(value: TransparencyRecord): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.publicationId.trim()) errors.push("publicationId_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.limitations.length) errors.push("limitations_required");
  if (!value.updatedAt.trim()) errors.push("updatedAt_required");
  if (!value.correctionRefs.length) errors.push("correctionRefs_required");
  if (!value.redressChannels.length) errors.push("redressChannels_required");
  return [...new Set(errors)];
}
