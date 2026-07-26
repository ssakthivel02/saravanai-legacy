import type { IntegrationPortabilityAndExit } from "./contracts";
import { validateIntegrationPortabilityAndExit } from "./contracts";
import { evaluateIntegrationPortabilityAndExit } from "./policy";

export function assessRelease529(value: IntegrationPortabilityAndExit) {
  const validationErrors = validateIntegrationPortabilityAndExit(value);
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
    decision: evaluateIntegrationPortabilityAndExit(value)
  };
}
