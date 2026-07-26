import type { KeyAndCertificateLifecycleAutomation } from "./contracts";
import { validateKeyAndCertificateLifecycleAutomation } from "./contracts";
import { evaluateKeyAndCertificateLifecycleAutomation } from "./policy";

export function assessRelease322(value: KeyAndCertificateLifecycleAutomation) {
  const validationErrors = validateKeyAndCertificateLifecycleAutomation(value);
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
    decision: evaluateKeyAndCertificateLifecycleAutomation(value)
  };
}
