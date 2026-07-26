import type { ResearchReportAndBriefingComposer } from "./contracts";
import { validateResearchReportAndBriefingComposer } from "./contracts";
import { evaluateResearchReportAndBriefingComposer } from "./policy";

export function assessRelease718(value: ResearchReportAndBriefingComposer) {
  const validationErrors = validateResearchReportAndBriefingComposer(value);
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
    decision: evaluateResearchReportAndBriefingComposer(value)
  };
}
