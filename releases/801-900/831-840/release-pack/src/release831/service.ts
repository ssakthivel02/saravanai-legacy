import type { KnowledgeSourceConnectorRuntime } from "./contracts";
import { validateKnowledgeSourceConnectorRuntime } from "./contracts";
import { evaluateKnowledgeSourceConnectorRuntime } from "./policy";

export function assessRelease831(value: KnowledgeSourceConnectorRuntime) {
  const validationErrors = validateKnowledgeSourceConnectorRuntime(value);
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
    decision: evaluateKnowledgeSourceConnectorRuntime(value)
  };
}
