import type { ResearchSynthesisAndArgumentMapping } from "./contracts";
import { validateResearchSynthesisAndArgumentMapping } from "./contracts";
import { evaluateResearchSynthesisAndArgumentMapping } from "./policy";

export function assessRelease715(value: ResearchSynthesisAndArgumentMapping) {
  const validationErrors = validateResearchSynthesisAndArgumentMapping(value);
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
    decision: evaluateResearchSynthesisAndArgumentMapping(value)
  };
}
