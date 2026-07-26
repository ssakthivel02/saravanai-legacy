export interface DocumentProcess {
  processRunId: string;
  tenantId: string;
  documentRef: string;
  classification: string;
  extractionSchemaId: string;
  confidence: number;
  humanReviewRequired: boolean;
  status: 'received' | 'validated' | 'review' | 'completed' | 'rejected';
}

export const RELEASE_265_CONTROLS = ["document_provenance_required", "classification_required", "confidence_bounded", "low_confidence_review"] as const;

export function validateDocumentProcess(value: DocumentProcess): string[] {
  const errors: string[] = [];
  if (!value.processRunId.trim()) errors.push("processRunId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.documentRef.trim()) errors.push("documentRef_required");
  if (!value.classification.trim()) errors.push("classification_required");
  if (!value.extractionSchemaId.trim()) errors.push("extractionSchemaId_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
