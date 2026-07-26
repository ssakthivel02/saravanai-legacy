export interface PlatformCapability {
  capabilityId: string;
  owner: string;
  apiVersion: string;
  requiredPermissions: string[];
  supportTier: string;
  status: 'preview' | 'stable' | 'deprecated';
}

export const RELEASE_161_CONTROLS = ["owner_required", "permissions_required", "version_required"] as const;

export function validatePlatformCapability(value: PlatformCapability): string[] {
  const errors: string[] = [];
  if (!value.capabilityId.trim()) errors.push("capabilityId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.apiVersion.trim()) errors.push("apiVersion_required");
  if (!value.requiredPermissions.length) errors.push("requiredPermissions_required");
  if (!value.supportTier.trim()) errors.push("supportTier_required");
  return [...new Set(errors)];
}
