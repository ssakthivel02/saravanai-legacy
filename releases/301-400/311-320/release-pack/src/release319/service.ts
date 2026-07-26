import type { HumanOversightAndOverrideOperations } from "./contracts";
import { validateHumanOversightAndOverrideOperations } from "./contracts";
import { evaluateHumanOversightAndOverrideOperations } from "./policy";

export function assessRelease319(value: HumanOversightAndOverrideOperations) {
  const validationErrors = validateHumanOversightAndOverrideOperations(value);
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
    decision: evaluateHumanOversightAndOverrideOperations(value)
  };
}
