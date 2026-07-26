export interface TechnologyRadarItem {
  itemId: string;
  technology: string;
  ring: 'adopt' | 'trial' | 'assess' | 'hold';
  owner: string;
  decisionRefs: string[];
  reviewAt: string;
  exceptionId: string | undefined;
}

export const RELEASE_212_CONTROLS = ["owner_required", "decision_evidence_required", "review_date_required", "exception_governed"] as const;

export function validateTechnologyRadarItem(value: TechnologyRadarItem): string[] {
  const errors: string[] = [];
  if (!value.itemId.trim()) errors.push("itemId_required");
  if (!value.technology.trim()) errors.push("technology_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.decisionRefs.length) errors.push("decisionRefs_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
