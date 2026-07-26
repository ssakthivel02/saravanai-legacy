import type { ProviderAdapterExecutionContractV2 } from "./contracts";
import { validateProviderAdapterExecutionContractV2 } from "./contracts";
import { evaluateProviderAdapterExecutionContractV2 } from "./policy";

export function assessRelease812(value: ProviderAdapterExecutionContractV2) {
  const validationErrors = validateProviderAdapterExecutionContractV2(value);
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
    decision: evaluateProviderAdapterExecutionContractV2(value)
  };
}
