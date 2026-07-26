import type { TenantScopedIndexAndRetrievalRuntime } from "./contracts";
import { validateTenantScopedIndexAndRetrievalRuntime } from "./contracts";
import { evaluateTenantScopedIndexAndRetrievalRuntime } from "./policy";

export function assessRelease833(value: TenantScopedIndexAndRetrievalRuntime) {
  const validationErrors = validateTenantScopedIndexAndRetrievalRuntime(value);
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
    decision: evaluateTenantScopedIndexAndRetrievalRuntime(value)
  };
}
