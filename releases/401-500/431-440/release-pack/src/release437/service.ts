import type { DataRetentionArchivalAndLegalHold } from "./contracts";
import { validateDataRetentionArchivalAndLegalHold } from "./contracts";
import { evaluateDataRetentionArchivalAndLegalHold } from "./policy";

export function assessRelease437(value: DataRetentionArchivalAndLegalHold) {
  const validationErrors = validateDataRetentionArchivalAndLegalHold(value);
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
    decision: evaluateDataRetentionArchivalAndLegalHold(value)
  };
}
