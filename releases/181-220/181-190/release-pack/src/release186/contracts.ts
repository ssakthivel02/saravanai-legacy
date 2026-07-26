export interface ToolInvocation {
  invocationId: string;
  tenantId: string;
  toolId: string;
  capability: string;
  targetHost: string;
  idempotencyKey: string;
  approvalId: string | undefined;
  writeAction: boolean;
}

export const RELEASE_186_CONTROLS = ["tool_allowlist_required", "egress_allowlist_required", "idempotency_required", "write_requires_approval"] as const;

export function validateToolInvocation(value: ToolInvocation): string[] {
  const errors: string[] = [];
  if (!value.invocationId.trim()) errors.push("invocationId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.toolId.trim()) errors.push("toolId_required");
  if (!value.capability.trim()) errors.push("capability_required");
  if (!value.targetHost.trim()) errors.push("targetHost_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  return [...new Set(errors)];
}
