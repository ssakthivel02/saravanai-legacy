export interface OperationalMemory {
  memoryId: string;
  tenantId: string;
  subjectRef: string;
  memoryClass: 'working' | 'project' | 'organisation';
  sourceRef: string;
  confidence: number;
  expiresAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export const RELEASE_185_CONTROLS = ["source_required", "confidence_bounded", "expiry_required", "tenant_isolation_required"] as const;

export function validateOperationalMemory(value: OperationalMemory): string[] {
  const errors: string[] = [];
  if (!value.memoryId.trim()) errors.push("memoryId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subjectRef.trim()) errors.push("subjectRef_required");
  if (!value.sourceRef.trim()) errors.push("sourceRef_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
