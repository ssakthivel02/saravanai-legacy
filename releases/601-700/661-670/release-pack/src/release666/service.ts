import type { AutomatedRemediationSafetyController } from "./contracts";
import { validateAutomatedRemediationSafetyController } from "./contracts";
import { evaluateAutomatedRemediationSafetyController } from "./policy";

export function assessRelease666(value: AutomatedRemediationSafetyController) {
  const validationErrors = validateAutomatedRemediationSafetyController(value);
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
    decision: evaluateAutomatedRemediationSafetyController(value)
  };
}
