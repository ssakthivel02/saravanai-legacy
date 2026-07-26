import type { PromptAssemblyAndContextPolicy } from "./contracts";
import { validatePromptAssemblyAndContextPolicy } from "./contracts";
import { evaluatePromptAssemblyAndContextPolicy } from "./policy";

export function assessRelease814(value: PromptAssemblyAndContextPolicy) {
  const validationErrors = validatePromptAssemblyAndContextPolicy(value);
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
    decision: evaluatePromptAssemblyAndContextPolicy(value)
  };
}
