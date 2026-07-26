import type { DisasterResponseResourceCoordination } from "./contracts";
import { validateDisasterResponseResourceCoordination } from "./contracts";
import { evaluateDisasterResponseResourceCoordination } from "./policy";

export function assessRelease563(value: DisasterResponseResourceCoordination) {
  const validationErrors = validateDisasterResponseResourceCoordination(value);
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
    decision: evaluateDisasterResponseResourceCoordination(value)
  };
}
