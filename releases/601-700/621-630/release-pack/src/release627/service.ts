import type { KnowledgeFreshnessAndExpiryOperations } from "./contracts";
import { validateKnowledgeFreshnessAndExpiryOperations } from "./contracts";
import { evaluateKnowledgeFreshnessAndExpiryOperations } from "./policy";

export function assessRelease627(value: KnowledgeFreshnessAndExpiryOperations) {
  const validationErrors = validateKnowledgeFreshnessAndExpiryOperations(value);
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
    decision: evaluateKnowledgeFreshnessAndExpiryOperations(value)
  };
}
