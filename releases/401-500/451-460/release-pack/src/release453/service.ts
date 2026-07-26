import type { AccessibleExperiencePersonalisation } from "./contracts";
import { validateAccessibleExperiencePersonalisation } from "./contracts";
import { evaluateAccessibleExperiencePersonalisation } from "./policy";

export function assessRelease453(value: AccessibleExperiencePersonalisation) {
  const validationErrors = validateAccessibleExperiencePersonalisation(value);
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
    decision: evaluateAccessibleExperiencePersonalisation(value)
  };
}
