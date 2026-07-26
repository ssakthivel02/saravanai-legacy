export interface CustomerWorkspaceTenantProvisioning {
  requestId: string;
  tenantId: string;
  owner: string;
  inputRef: string;
  policyRefs: string[];
  evidenceRefs: string[];
  idempotencyKey: string;
  resultRef: string | undefined;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'failed';
}

export const RELEASE_841_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "strict_input_schema_required", "idempotency_required", "result_evidence_required", "tenant_isolation_required", "workspace_portability_required", "customer_redress_required"] as const;

export function validateCustomerWorkspaceTenantProvisioning(value: CustomerWorkspaceTenantProvisioning): string[] {
  const errors: string[] = [];
  if (!value.requestId.trim()) errors.push("requestId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.inputRef.trim()) errors.push("inputRef_required");
  if (!value.policyRefs.length) errors.push("policyRefs_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  return [...new Set(errors)];
}
