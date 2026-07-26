import type { WorkerWellbeingAndResponsibleAutomation } from "./contracts";
import { validateWorkerWellbeingAndResponsibleAutomation } from "./contracts";
import { evaluateWorkerWellbeingAndResponsibleAutomation } from "./policy";

export function assessRelease466(value: WorkerWellbeingAndResponsibleAutomation) {
  const validationErrors = validateWorkerWellbeingAndResponsibleAutomation(value);
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
    decision: evaluateWorkerWellbeingAndResponsibleAutomation(value)
  };
}
