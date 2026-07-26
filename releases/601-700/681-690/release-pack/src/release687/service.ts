import type { AuditRequestAndEvidenceWorkspace } from "./contracts";
import { validateAuditRequestAndEvidenceWorkspace } from "./contracts";
import { evaluateAuditRequestAndEvidenceWorkspace } from "./policy";

export function assessRelease687(value: AuditRequestAndEvidenceWorkspace) {
  const validationErrors = validateAuditRequestAndEvidenceWorkspace(value);
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
    decision: evaluateAuditRequestAndEvidenceWorkspace(value)
  };
}
