import type { OTEdgeAndIoTAssuranceGate } from "./contracts";
import { validateOTEdgeAndIoTAssuranceGate } from "./contracts";
import { evaluateOTEdgeAndIoTAssuranceGate } from "./policy";

export function assessRelease760(value: OTEdgeAndIoTAssuranceGate) {
  const validationErrors = validateOTEdgeAndIoTAssuranceGate(value);
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
    decision: evaluateOTEdgeAndIoTAssuranceGate(value)
  };
}
