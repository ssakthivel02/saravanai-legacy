import type { EnterpriseEditionV3GeneralAvailabilityBoard } from "./contracts";
import { validateEnterpriseEditionV3GeneralAvailabilityBoard } from "./contracts";
import { evaluateEnterpriseEditionV3GeneralAvailabilityBoard } from "./policy";

export function assessRelease399(value: EnterpriseEditionV3GeneralAvailabilityBoard) {
  const validationErrors = validateEnterpriseEditionV3GeneralAvailabilityBoard(value);
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
    decision: evaluateEnterpriseEditionV3GeneralAvailabilityBoard(value)
  };
}
