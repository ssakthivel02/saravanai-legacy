import type { APISecurityAndAbuseProtectionV2 } from "./contracts";
import { validateAPISecurityAndAbuseProtectionV2 } from "./contracts";
import { evaluateAPISecurityAndAbuseProtectionV2 } from "./policy";

export function assessRelease526(value: APISecurityAndAbuseProtectionV2) {
  const validationErrors = validateAPISecurityAndAbuseProtectionV2(value);
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
    decision: evaluateAPISecurityAndAbuseProtectionV2(value)
  };
}
