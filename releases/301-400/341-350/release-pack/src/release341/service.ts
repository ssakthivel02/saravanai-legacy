import type { DataContractRegistryV2 } from "./contracts";
import { validateDataContractRegistryV2 } from "./contracts";
import { evaluateDataContractRegistryV2 } from "./policy";

export function assessRelease341(value: DataContractRegistryV2) {
  const validationErrors = validateDataContractRegistryV2(value);
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
    decision: evaluateDataContractRegistryV2(value)
  };
}
