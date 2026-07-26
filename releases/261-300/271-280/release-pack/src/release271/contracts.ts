export interface KnowledgePublication {
  publicationId: string;
  tenantId: string;
  owner: string;
  version: string;
  audiences: string[];
  sourceRefs: string[];
  reviewedBy: string;
  status: 'draft' | 'published' | 'corrected' | 'retired';
}

export const RELEASE_271_CONTROLS = ["owner_required", "source_provenance_required", "review_required", "retirement_supported"] as const;

export function validateKnowledgePublication(value: KnowledgePublication): string[] {
  const errors: string[] = [];
  if (!value.publicationId.trim()) errors.push("publicationId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.audiences.length) errors.push("audiences_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.reviewedBy.trim()) errors.push("reviewedBy_required");
  return [...new Set(errors)];
}
