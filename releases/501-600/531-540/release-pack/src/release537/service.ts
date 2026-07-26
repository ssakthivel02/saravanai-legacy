import type { ApplicationRebuildFactory } from "./contracts";
import { validateApplicationRebuildFactory } from "./contracts";
import { evaluateApplicationRebuildFactory } from "./policy";

export function assessRelease537(value: ApplicationRebuildFactory) {
  const validationErrors = validateApplicationRebuildFactory(value);
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
    decision: evaluateApplicationRebuildFactory(value)
  };
}
