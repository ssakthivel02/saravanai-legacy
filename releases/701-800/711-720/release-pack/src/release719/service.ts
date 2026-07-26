import type { ResearchCorrectionAndRetractionWorkflow } from "./contracts";
import { validateResearchCorrectionAndRetractionWorkflow } from "./contracts";
import { evaluateResearchCorrectionAndRetractionWorkflow } from "./policy";

export function assessRelease719(value: ResearchCorrectionAndRetractionWorkflow) {
  const validationErrors = validateResearchCorrectionAndRetractionWorkflow(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateResearchCorrectionAndRetractionWorkflow(value)
  };
}
