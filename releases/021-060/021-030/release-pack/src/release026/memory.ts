export type MemoryClass = "working" | "conversation" | "project" | "organisation" | "personal_preference";

export interface MemoryRecord {
  memoryId: string;
  tenantId: string;
  subjectId: string;
  class: MemoryClass;
  content: string;
  sourceRef: string;
  consentBasis: string;
  createdAt: string;
  expiresAt: string;
  qualityScore: number;
  sensitivity: "normal" | "sensitive" | "restricted";
  status: "pending" | "approved" | "rejected" | "expired";
}

export function validateMemory(record: MemoryRecord): string[] {
  const errors: string[] = [];
  if (!record.sourceRef) errors.push("source_required");
  if (!record.consentBasis) errors.push("consent_basis_required");
  if (record.qualityScore < 0 || record.qualityScore > 1) errors.push("quality_score_out_of_range");
  if (record.sensitivity === "restricted" && record.status === "approved") errors.push("restricted_memory_requires_special_approval");
  return errors;
}
