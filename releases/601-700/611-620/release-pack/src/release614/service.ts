import type { ToolInvocationGateway } from "./contracts";
import { validateToolInvocationGateway } from "./contracts";
import { evaluateToolInvocationGateway } from "./policy";

export function assessRelease614(value: ToolInvocationGateway) {
  const validationErrors = validateToolInvocationGateway(value);
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
    decision: evaluateToolInvocationGateway(value)
  };
}
