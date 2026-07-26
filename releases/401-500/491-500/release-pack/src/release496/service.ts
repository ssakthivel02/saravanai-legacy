import type { EnterpriseSupportAndEscalationModelV2 } from "./contracts";
import { validateEnterpriseSupportAndEscalationModelV2 } from "./contracts";
import { evaluateEnterpriseSupportAndEscalationModelV2 } from "./policy";

export function assessRelease496(value: EnterpriseSupportAndEscalationModelV2) {
  const validationErrors = validateEnterpriseSupportAndEscalationModelV2(value);
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
    decision: evaluateEnterpriseSupportAndEscalationModelV2(value)
  };
}
