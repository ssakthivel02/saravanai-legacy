import type { IntegrationObservabilityAndServiceObjectives } from "./contracts";
import { validateIntegrationObservabilityAndServiceObjectives } from "./contracts";
import { evaluateIntegrationObservabilityAndServiceObjectives } from "./policy";

export function assessRelease528(value: IntegrationObservabilityAndServiceObjectives) {
  const validationErrors = validateIntegrationObservabilityAndServiceObjectives(value);
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
    decision: evaluateIntegrationObservabilityAndServiceObjectives(value)
  };
}
