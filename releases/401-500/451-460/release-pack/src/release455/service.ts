import type { ConversationalAICustomerSupport } from "./contracts";
import { validateConversationalAICustomerSupport } from "./contracts";
import { evaluateConversationalAICustomerSupport } from "./policy";

export function assessRelease455(value: ConversationalAICustomerSupport) {
  const validationErrors = validateConversationalAICustomerSupport(value);
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
    decision: evaluateConversationalAICustomerSupport(value)
  };
}
