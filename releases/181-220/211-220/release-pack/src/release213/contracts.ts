export interface ScenarioForecast {
  scenarioId: string;
  name: string;
  assumptions: string[];
  evidenceRefs: string[];
  confidence: number;
  triggerIndicators: string[];
  reviewedBy: string | undefined;
  status: 'draft' | 'reviewed' | 'retired';
}

export const RELEASE_213_CONTROLS = ["assumptions_explicit", "evidence_required", "confidence_bounded", "human_review_required"] as const;

export function validateScenarioForecast(value: ScenarioForecast): string[] {
  const errors: string[] = [];
  if (!value.scenarioId.trim()) errors.push("scenarioId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.assumptions.length) errors.push("assumptions_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (!value.triggerIndicators.length) errors.push("triggerIndicators_required");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
