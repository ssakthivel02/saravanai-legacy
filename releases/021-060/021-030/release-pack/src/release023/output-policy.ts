export interface OutputAssessment {
  allowed: boolean;
  requiresHumanReview: boolean;
  reasons: string[];
}

export function assessOutput(input: {
  hasCitations: boolean;
  currentFactRequest: boolean;
  containsSensitiveData: boolean;
  confidence?: number;
}): OutputAssessment {
  const reasons: string[] = [];
  if (input.currentFactRequest && !input.hasCitations) reasons.push("citations_required_for_current_facts");
  if (input.containsSensitiveData) reasons.push("sensitive_data_detected");
  if (typeof input.confidence === "number" && input.confidence < 0.6) reasons.push("low_confidence");
  return {
    allowed: reasons.length === 0,
    requiresHumanReview: reasons.length > 0,
    reasons
  };
}
