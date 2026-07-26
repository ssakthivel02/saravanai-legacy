import type { OmnichannelCustomerContactProfile } from "./contracts";
import { validateOmnichannelCustomerContactProfile } from "./contracts";
import { evaluateOmnichannelCustomerContactProfile } from "./policy";

export function assessRelease734(value: OmnichannelCustomerContactProfile) {
  const validationErrors = validateOmnichannelCustomerContactProfile(value);
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
    decision: evaluateOmnichannelCustomerContactProfile(value)
  };
}
