import type { ApplicationAndWebsiteFactoryAssuranceGate } from "./contracts";
import { validateApplicationAndWebsiteFactoryAssuranceGate } from "./contracts";
import { evaluateApplicationAndWebsiteFactoryAssuranceGate } from "./policy";

export function assessRelease730(value: ApplicationAndWebsiteFactoryAssuranceGate) {
  const validationErrors = validateApplicationAndWebsiteFactoryAssuranceGate(value);
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
    decision: evaluateApplicationAndWebsiteFactoryAssuranceGate(value)
  };
}
