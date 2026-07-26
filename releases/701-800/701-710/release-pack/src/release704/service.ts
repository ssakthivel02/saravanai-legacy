import type { PromptInjectionAndToolAbuseTesting } from "./contracts";
import { validatePromptInjectionAndToolAbuseTesting } from "./contracts";
import { evaluatePromptInjectionAndToolAbuseTesting } from "./policy";

export function assessRelease704(value: PromptInjectionAndToolAbuseTesting) {
  const validationErrors = validatePromptInjectionAndToolAbuseTesting(value);
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
    decision: evaluatePromptInjectionAndToolAbuseTesting(value)
  };
}
