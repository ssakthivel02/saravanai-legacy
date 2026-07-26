export interface DeveloperPortalAndServiceCatalogue {
  profileId: string;
  tenantId: string;
  owner: string;
  policyRefs: string[];
  controlRefs: string[];
  evidenceRefs: string[];
  reviewAt: string;
  status: 'draft' | 'approved' | 'restricted' | 'retired';
}

export const RELEASE_335_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "tenant_scope_required", "policy_binding_required"] as const;

export function validateDeveloperPortalAndServiceCatalogue(value: DeveloperPortalAndServiceCatalogue): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.policyRefs.length) errors.push("policyRefs_required");
  if (!value.controlRefs.length) errors.push("controlRefs_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
