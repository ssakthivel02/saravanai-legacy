import type { ApplicationIntegrationAndAPIComposition } from "./contracts";
import { validateApplicationIntegrationAndAPIComposition } from "./contracts";
import { evaluateApplicationIntegrationAndAPIComposition } from "./policy";

export function assessRelease727(value: ApplicationIntegrationAndAPIComposition) {
  const validationErrors = validateApplicationIntegrationAndAPIComposition(value);
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
    decision: evaluateApplicationIntegrationAndAPIComposition(value)
  };
}
