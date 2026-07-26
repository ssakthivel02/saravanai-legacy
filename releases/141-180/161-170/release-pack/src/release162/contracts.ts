export interface GoldenPath {
  pathId: string;
  version: string;
  owner: string;
  templateRefs: string[];
  securityControlRefs: string[];
  status: 'draft' | 'approved' | 'deprecated';
}

export const RELEASE_162_CONTROLS = ["owner_required", "security_controls_required", "approval_before_use"] as const;

export function validateGoldenPath(value: GoldenPath): string[] {
  const errors: string[] = [];
  if (!value.pathId.trim()) errors.push("pathId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.templateRefs.length) errors.push("templateRefs_required");
  if (!value.securityControlRefs.length) errors.push("securityControlRefs_required");
  return [...new Set(errors)];
}
