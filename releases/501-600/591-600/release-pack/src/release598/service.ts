import type { EnterpriseExitAndDataPortabilityV3 } from "./contracts";
import { validateEnterpriseExitAndDataPortabilityV3 } from "./contracts";
import { evaluateEnterpriseExitAndDataPortabilityV3 } from "./policy";

export function assessRelease598(value: EnterpriseExitAndDataPortabilityV3) {
  const validationErrors = validateEnterpriseExitAndDataPortabilityV3(value);
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
    decision: evaluateEnterpriseExitAndDataPortabilityV3(value)
  };
}
