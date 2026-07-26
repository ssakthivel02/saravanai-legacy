export interface HeritageKnowledgeClaim {
  claimId: string;
  tradition: string;
  claimType: 'documented' | 'traditional_belief' | 'scholarly_interpretation' | 'unverified';
  confidence: 'high' | 'medium' | 'low';
  sourceRefs: string[];
  sensitivityReviewer: string;
  status: 'draft' | 'reviewed' | 'published' | 'withdrawn';
}

export const RELEASE_278_CONTROLS = ["claim_type_required", "confidence_required", "sources_required", "sensitivity_review_required"] as const;

export function validateHeritageKnowledgeClaim(value: HeritageKnowledgeClaim): string[] {
  const errors: string[] = [];
  if (!value.claimId.trim()) errors.push("claimId_required");
  if (!value.tradition.trim()) errors.push("tradition_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.sensitivityReviewer.trim()) errors.push("sensitivityReviewer_required");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
