import type { EngineeringWorkItemIntelligence } from "./contracts";
import { validateEngineeringWorkItemIntelligence } from "./contracts";
import { evaluateEngineeringWorkItemIntelligence } from "./policy";

export function assessRelease471(value: EngineeringWorkItemIntelligence) {
  const validationErrors = validateEngineeringWorkItemIntelligence(value);
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
    decision: evaluateEngineeringWorkItemIntelligence(value)
  };
}
