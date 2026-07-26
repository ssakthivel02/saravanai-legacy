import type { EnterpriseDataProductRegistry } from "./contracts";
import { validateEnterpriseDataProductRegistry } from "./contracts";
import { evaluateEnterpriseDataProductRegistry } from "./policy";

export function assessRelease771(value: EnterpriseDataProductRegistry) {
  const validationErrors = validateEnterpriseDataProductRegistry(value);
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
    decision: evaluateEnterpriseDataProductRegistry(value)
  };
}
