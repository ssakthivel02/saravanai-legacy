import type { AIRequestIdempotencyAndReplayProtection } from "./contracts";
import { validateAIRequestIdempotencyAndReplayProtection } from "./contracts";
import { evaluateAIRequestIdempotencyAndReplayProtection } from "./policy";

export function assessRelease817(value: AIRequestIdempotencyAndReplayProtection) {
  const validationErrors = validateAIRequestIdempotencyAndReplayProtection(value);
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
    decision: evaluateAIRequestIdempotencyAndReplayProtection(value)
  };
}
