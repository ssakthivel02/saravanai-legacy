import type { TenantQuotaAndFairUseRuntime } from "./contracts";
import { validateTenantQuotaAndFairUseRuntime } from "./contracts";
import { evaluateTenantQuotaAndFairUseRuntime } from "./policy";

export function assessRelease882(value: TenantQuotaAndFairUseRuntime) {
  const validationErrors = validateTenantQuotaAndFairUseRuntime(value);
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
    decision: evaluateTenantQuotaAndFairUseRuntime(value)
  };
}
