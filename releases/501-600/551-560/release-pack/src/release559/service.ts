import type { WorkplaceChangeAndAdoption } from "./contracts";
import { validateWorkplaceChangeAndAdoption } from "./contracts";
import { evaluateWorkplaceChangeAndAdoption } from "./policy";

export function assessRelease559(value: WorkplaceChangeAndAdoption) {
  const validationErrors = validateWorkplaceChangeAndAdoption(value);
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
    decision: evaluateWorkplaceChangeAndAdoption(value)
  };
}
