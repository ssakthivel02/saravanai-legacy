import type { EnterprisePlatformV8RuntimeCapabilityMap } from "./contracts";
import { validateEnterprisePlatformV8RuntimeCapabilityMap } from "./contracts";
import { evaluateEnterprisePlatformV8RuntimeCapabilityMap } from "./policy";

export function assessRelease891(value: EnterprisePlatformV8RuntimeCapabilityMap) {
  const validationErrors = validateEnterprisePlatformV8RuntimeCapabilityMap(value);
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
    decision: evaluateEnterprisePlatformV8RuntimeCapabilityMap(value)
  };
}
