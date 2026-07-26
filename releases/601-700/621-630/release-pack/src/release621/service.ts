import type { EnterpriseSourceAndCollectionRegistry } from "./contracts";
import { validateEnterpriseSourceAndCollectionRegistry } from "./contracts";
import { evaluateEnterpriseSourceAndCollectionRegistry } from "./policy";

export function assessRelease621(value: EnterpriseSourceAndCollectionRegistry) {
  const validationErrors = validateEnterpriseSourceAndCollectionRegistry(value);
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
    decision: evaluateEnterpriseSourceAndCollectionRegistry(value)
  };
}
