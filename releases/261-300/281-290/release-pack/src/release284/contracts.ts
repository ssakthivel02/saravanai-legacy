export interface RegulatoryObligation {
  obligationId: string;
  jurisdiction: string;
  owner: string;
  summary: string;
  controlIds: string[];
  effectiveFrom: string;
  legalReviewer: string;
  status: 'draft' | 'applicable' | 'not_applicable' | 'retired';
}

export const RELEASE_284_CONTROLS = ["jurisdiction_required", "owner_required", "controls_mapped", "legal_review_required"] as const;

export function validateRegulatoryObligation(value: RegulatoryObligation): string[] {
  const errors: string[] = [];
  if (!value.obligationId.trim()) errors.push("obligationId_required");
  if (!value.jurisdiction.trim()) errors.push("jurisdiction_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.summary.trim()) errors.push("summary_required");
  if (!value.controlIds.length) errors.push("controlIds_required");
  if (!value.effectiveFrom.trim()) errors.push("effectiveFrom_required");
  if (!value.legalReviewer.trim()) errors.push("legalReviewer_required");
  return [...new Set(errors)];
}
