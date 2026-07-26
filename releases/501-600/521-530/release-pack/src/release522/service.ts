import type { EventContractAndSchemaRegistry } from "./contracts";
import { validateEventContractAndSchemaRegistry } from "./contracts";
import { evaluateEventContractAndSchemaRegistry } from "./policy";

export function assessRelease522(value: EventContractAndSchemaRegistry) {
  const validationErrors = validateEventContractAndSchemaRegistry(value);
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
    decision: evaluateEventContractAndSchemaRegistry(value)
  };
}
