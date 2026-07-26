import type { RuntimeIdentityContextResolver } from "./contracts";
import { validateRuntimeIdentityContextResolver } from "./contracts";
import { evaluateRuntimeIdentityContextResolver } from "./policy";

export function assessRelease801(value: RuntimeIdentityContextResolver) {
  const validationErrors = validateRuntimeIdentityContextResolver(value);
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
    decision: evaluateRuntimeIdentityContextResolver(value)
  };
}
