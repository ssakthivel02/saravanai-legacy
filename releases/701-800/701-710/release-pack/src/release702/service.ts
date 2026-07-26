import type { ModelCapabilityBenchmarkFramework } from "./contracts";
import { validateModelCapabilityBenchmarkFramework } from "./contracts";
import { evaluateModelCapabilityBenchmarkFramework } from "./policy";

export function assessRelease702(value: ModelCapabilityBenchmarkFramework) {
  const validationErrors = validateModelCapabilityBenchmarkFramework(value);
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
    decision: evaluateModelCapabilityBenchmarkFramework(value)
  };
}
