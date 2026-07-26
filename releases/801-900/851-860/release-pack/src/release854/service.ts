import type { AuditEvidenceRequestAndAccessWorkflow } from "./contracts";
import { validateAuditEvidenceRequestAndAccessWorkflow } from "./contracts";
import { evaluateAuditEvidenceRequestAndAccessWorkflow } from "./policy";

export function assessRelease854(value: AuditEvidenceRequestAndAccessWorkflow) {
  const validationErrors = validateAuditEvidenceRequestAndAccessWorkflow(value);
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
    decision: evaluateAuditEvidenceRequestAndAccessWorkflow(value)
  };
}
