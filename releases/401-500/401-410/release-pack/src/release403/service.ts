import type { PromptProgrammeAndTemplateGovernance } from "./contracts";
import { validatePromptProgrammeAndTemplateGovernance } from "./contracts";
import { evaluatePromptProgrammeAndTemplateGovernance } from "./policy";

export function assessRelease403(value: PromptProgrammeAndTemplateGovernance) {
  const validationErrors = validatePromptProgrammeAndTemplateGovernance(value);
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
    decision: evaluatePromptProgrammeAndTemplateGovernance(value)
  };
}
