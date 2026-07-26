import type { EnvironmentConfigurationAndSecretReadiness } from "./contracts";
import { validateEnvironmentConfigurationAndSecretReadiness } from "./contracts";
import { evaluateEnvironmentConfigurationAndSecretReadiness } from "./policy";

export function assessRelease793(value: EnvironmentConfigurationAndSecretReadiness) {
  const validationErrors = validateEnvironmentConfigurationAndSecretReadiness(value);
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
    decision: evaluateEnvironmentConfigurationAndSecretReadiness(value)
  };
}
