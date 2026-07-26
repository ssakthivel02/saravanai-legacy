import type { CrossBorderDataTransferGovernance } from "./contracts";
import { validateCrossBorderDataTransferGovernance } from "./contracts";
import { evaluateCrossBorderDataTransferGovernance } from "./policy";

export function assessRelease482(value: CrossBorderDataTransferGovernance) {
  const validationErrors = validateCrossBorderDataTransferGovernance(value);
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
    decision: evaluateCrossBorderDataTransferGovernance(value)
  };
}
