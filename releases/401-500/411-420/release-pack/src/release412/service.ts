import type { OfflineAndDisconnectedAIRuntime } from "./contracts";
import { validateOfflineAndDisconnectedAIRuntime } from "./contracts";
import { evaluateOfflineAndDisconnectedAIRuntime } from "./policy";

export function assessRelease412(value: OfflineAndDisconnectedAIRuntime) {
  const validationErrors = validateOfflineAndDisconnectedAIRuntime(value);
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
    decision: evaluateOfflineAndDisconnectedAIRuntime(value)
  };
}
