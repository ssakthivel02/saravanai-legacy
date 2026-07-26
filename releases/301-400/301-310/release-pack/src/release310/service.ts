import type { DigitalTwinAssuranceGate } from "./contracts";
import { validateDigitalTwinAssuranceGate } from "./contracts";
import { evaluateDigitalTwinAssuranceGate } from "./policy";

export function assessRelease310(value: DigitalTwinAssuranceGate) {
  const validationErrors = validateDigitalTwinAssuranceGate(value);
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
    decision: evaluateDigitalTwinAssuranceGate(value)
  };
}
