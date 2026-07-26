import type { DataProductDeprecationAndPortability } from "./contracts";
import { validateDataProductDeprecationAndPortability } from "./contracts";
import { evaluateDataProductDeprecationAndPortability } from "./policy";

export function assessRelease779(value: DataProductDeprecationAndPortability) {
  const validationErrors = validateDataProductDeprecationAndPortability(value);
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
    decision: evaluateDataProductDeprecationAndPortability(value)
  };
}
