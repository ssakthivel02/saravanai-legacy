import type { RegionalActiveActiveReadiness } from "./contracts";
import { validateRegionalActiveActiveReadiness } from "./contracts";
import { evaluateRegionalActiveActiveReadiness } from "./policy";

export function assessRelease372(value: RegionalActiveActiveReadiness) {
  const validationErrors = validateRegionalActiveActiveReadiness(value);
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
    decision: evaluateRegionalActiveActiveReadiness(value)
  };
}
