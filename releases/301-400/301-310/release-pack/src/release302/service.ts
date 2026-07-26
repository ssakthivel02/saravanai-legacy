import type { EnvironmentAndInfrastructureTwin } from "./contracts";
import { validateEnvironmentAndInfrastructureTwin } from "./contracts";
import { evaluateEnvironmentAndInfrastructureTwin } from "./policy";

export function assessRelease302(value: EnvironmentAndInfrastructureTwin) {
  const validationErrors = validateEnvironmentAndInfrastructureTwin(value);
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
    decision: evaluateEnvironmentAndInfrastructureTwin(value)
  };
}
