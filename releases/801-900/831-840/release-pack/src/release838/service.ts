import type { ResearchSynthesisAndReportPipeline } from "./contracts";
import { validateResearchSynthesisAndReportPipeline } from "./contracts";
import { evaluateResearchSynthesisAndReportPipeline } from "./policy";

export function assessRelease838(value: ResearchSynthesisAndReportPipeline) {
  const validationErrors = validateResearchSynthesisAndReportPipeline(value);
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
    decision: evaluateResearchSynthesisAndReportPipeline(value)
  };
}
