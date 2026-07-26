import type { TenantOnboardingAndConfigurationFactoryV2 } from "./contracts";
import { validateTenantOnboardingAndConfigurationFactoryV2 } from "./contracts";
import { evaluateTenantOnboardingAndConfigurationFactoryV2 } from "./policy";

export function assessRelease693(value: TenantOnboardingAndConfigurationFactoryV2) {
  const validationErrors = validateTenantOnboardingAndConfigurationFactoryV2(value);
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
    decision: evaluateTenantOnboardingAndConfigurationFactoryV2(value)
  };
}
