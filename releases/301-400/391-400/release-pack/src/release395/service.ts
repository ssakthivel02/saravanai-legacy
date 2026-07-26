import type { WorkforceTransitionAndSkillsAssurance } from "./contracts";
import { validateWorkforceTransitionAndSkillsAssurance } from "./contracts";
import { evaluateWorkforceTransitionAndSkillsAssurance } from "./policy";

export function assessRelease395(value: WorkforceTransitionAndSkillsAssurance) {
  const validationErrors = validateWorkforceTransitionAndSkillsAssurance(value);
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
    decision: evaluateWorkforceTransitionAndSkillsAssurance(value)
  };
}
