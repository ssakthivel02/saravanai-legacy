import type { IdentityAndTenantRuntimeActivationGate } from "./contracts";
import { validateIdentityAndTenantRuntimeActivationGate } from "./contracts";
import { evaluateIdentityAndTenantRuntimeActivationGate } from "./policy";

export function assessRelease810(value: IdentityAndTenantRuntimeActivationGate) {
  const validationErrors = validateIdentityAndTenantRuntimeActivationGate(value);
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
    decision: evaluateIdentityAndTenantRuntimeActivationGate(value)
  };
}
