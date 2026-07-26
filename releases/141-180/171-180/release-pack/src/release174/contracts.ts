export interface PluginAssessment {
  pluginId: string;
  publisher: string;
  permissions: string[];
  allowedHosts: string[];
  signatureRef: string;
  status: 'draft' | 'verified' | 'revoked';
}

export const RELEASE_174_CONTROLS = ["publisher_required", "permission_minimisation", "egress_allowlist_required"] as const;

export function validatePluginAssessment(value: PluginAssessment): string[] {
  const errors: string[] = [];
  if (!value.pluginId.trim()) errors.push("pluginId_required");
  if (!value.publisher.trim()) errors.push("publisher_required");
  if (!value.permissions.length) errors.push("permissions_required");
  if (!value.allowedHosts.length) errors.push("allowedHosts_required");
  if (!value.signatureRef.trim()) errors.push("signatureRef_required");
  return [...new Set(errors)];
}
