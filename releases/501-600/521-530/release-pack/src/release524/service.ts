import type { ConnectorAndAdapterFramework } from "./contracts";
import { validateConnectorAndAdapterFramework } from "./contracts";
import { evaluateConnectorAndAdapterFramework } from "./policy";

export function assessRelease524(value: ConnectorAndAdapterFramework) {
  const validationErrors = validateConnectorAndAdapterFramework(value);
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
    decision: evaluateConnectorAndAdapterFramework(value)
  };
}
