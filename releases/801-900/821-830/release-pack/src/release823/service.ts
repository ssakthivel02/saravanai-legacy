import type { ToolLeaseAndScopedCapabilityRuntime } from "./contracts";
import { validateToolLeaseAndScopedCapabilityRuntime } from "./contracts";
import { evaluateToolLeaseAndScopedCapabilityRuntime } from "./policy";

export function assessRelease823(value: ToolLeaseAndScopedCapabilityRuntime) {
  const validationErrors = validateToolLeaseAndScopedCapabilityRuntime(value);
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
    decision: evaluateToolLeaseAndScopedCapabilityRuntime(value)
  };
}
