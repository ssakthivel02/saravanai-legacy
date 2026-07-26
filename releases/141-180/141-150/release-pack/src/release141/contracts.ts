export interface WorkspaceProfile {
  workspaceId: string;
  tenantId: string;
  ownerSubject: string;
  enabledModules: string[];
  defaultModule: string;
  status: 'active' | 'suspended';
}

export const RELEASE_141_CONTROLS = ["tenant_scope_required", "module_permissions_required", "session_boundary_required"] as const;

export function validateWorkspaceProfile(value: WorkspaceProfile): string[] {
  const errors: string[] = [];
  if (!value.workspaceId.trim()) errors.push("workspaceId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.ownerSubject.trim()) errors.push("ownerSubject_required");
  if (!value.enabledModules.length) errors.push("enabledModules_required");
  if (!value.defaultModule.trim()) errors.push("defaultModule_required");
  return [...new Set(errors)];
}
