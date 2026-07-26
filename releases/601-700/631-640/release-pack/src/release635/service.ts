import type { PrivacyPreservingAnalyticsRuntime } from "./contracts";
import { validatePrivacyPreservingAnalyticsRuntime } from "./contracts";
import { evaluatePrivacyPreservingAnalyticsRuntime } from "./policy";

export function assessRelease635(value: PrivacyPreservingAnalyticsRuntime) {
  const validationErrors = validatePrivacyPreservingAnalyticsRuntime(value);
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
    decision: evaluatePrivacyPreservingAnalyticsRuntime(value)
  };
}
