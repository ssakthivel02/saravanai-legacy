export interface CollaborationSpace {
  spaceId: string;
  tenantId: string;
  members: string[];
  resourceRefs: string[];
  retentionPolicyId: string;
  externalSharingAllowed: false;
}

export const RELEASE_147_CONTROLS = ["tenant_isolation_required", "retention_required", "external_sharing_default_deny"] as const;

export function validateCollaborationSpace(value: CollaborationSpace): string[] {
  const errors: string[] = [];
  if (!value.spaceId.trim()) errors.push("spaceId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.members.length) errors.push("members_required");
  if (!value.resourceRefs.length) errors.push("resourceRefs_required");
  if (!value.retentionPolicyId.trim()) errors.push("retentionPolicyId_required");
  if (value.externalSharingAllowed !== false) errors.push("externalSharingAllowed_must_remain_false");
  return [...new Set(errors)];
}
