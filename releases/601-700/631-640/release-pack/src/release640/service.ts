import type { DataSovereigntyAssuranceGate } from "./contracts";
import { validateDataSovereigntyAssuranceGate } from "./contracts";
import { evaluateDataSovereigntyAssuranceGate } from "./policy";

export function assessRelease640(value: DataSovereigntyAssuranceGate) {
  const validationErrors = validateDataSovereigntyAssuranceGate(value);
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
    decision: evaluateDataSovereigntyAssuranceGate(value)
  };
}
